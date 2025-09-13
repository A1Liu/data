package dbutil

import (
	"context"
	"fmt"
	"slices"
	"strings"
	// "time"

	// "github.com/jackc/pgx/v5/pgtype"
	// "github.com/jackc/tern/v2/migrate"
	"a1liu.com/data/api/model"
	"a1liu.com/data/api/util"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func WriteUnversionedDataToTable(
	ctx context.Context,
	conn *pgxpool.Conn,
	table string,
	rows []map[string]any,
) (int64, error) {
	// TODO: cache this
	columns, err := ListTableColumns(ctx, conn, table)
	if err != nil {
		return 0, err
	}

	rowCols := len(columns)
	rowMap := make(map[string][]any, rowCols)
	escaped := make([]string, len(columns))[:0]
	named := make([]string, len(columns))[:0]

	for _, col := range columns {
		// Prepare query for table
		// TODO string sanitization
		escaped = append(escaped, fmt.Sprintf(`"%v"`, col.Name))
		named = append(named, fmt.Sprintf("@%v::%v[]", col.Name, col.DataTypeName))

		// columnize rows
		rowMap[col.Name] = make([]any, len(rows))
	}

	for idx, row := range rows {
		for key, value := range row {
			rowMap[key][idx] = value
		}
	}

	// TODO unnest does more than 1 layer of unnesting. need to use JSONB as intermediate
	// layer or look into a custom function

	// With some SO/Google/GPT help, I got this weirdness:
	//
	// SELECT
	// uuids[i] AS id,
	// texts[i:i] AS tags
	// FROM
	//   generate_series(1, 2) AS i
	// JOIN LATERAL
	//   (SELECT $1::uuid[] AS uuids, $2::text[][] AS texts) AS arrays ON true;
	//
	// Which for simple cases would work for multidimensional arrays. generate_series
	// creates indices which are used to index into the parameters. It doesn't quite
	// fit with things when allowing for null though. Probably need to do a JSONB
	// intermediate transition for array types no matter what.

	query := fmt.Sprintf(`
	INSERT INTO "%s" (%s)
	SELECT *
	FROM UNNEST(%s)
	;
	`, table, strings.Join(escaped, ","), strings.Join(named, ","))

	args := pgx.NamedArgs{}
	for k, v := range rowMap {
		args[k] = v
	}

	tag, err := conn.Exec(ctx, query, args)
	return tag.RowsAffected(), err
}

func WriteTableImports(
	ctx context.Context,
	pool *pgxpool.Pool,
	imports []model.TableImportInput, // TODO: common case is snapshot where they're all the same
) (int64, error) {
	if len(imports) == 0 {
		return 0, nil
	}

	// Ensure it's sorted.
	imports = slices.Clone(imports)
	slices.SortStableFunc(imports, func(a, b model.TableImportInput) int {
		return int(a.Version - b.Version)
	})

	conn, err := pool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Release()

	_, err = conn.Exec(ctx, "CREATE DATABASE tmp")
	if err != nil {
		return 0, err
	}
	defer conn.Exec(ctx, "DROP DATABASE tmp;")

	tmpPool, err := util.GetPgxDatabase("tmp")
	if err != nil {
		return 0, err
	}
	defer tmpPool.Close()

	tmpConn, err := tmpPool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer tmpConn.Release()

	migrator, err := Migrator(ctx, tmpConn)

	var rowCount int64 = 0
	var vers int32 = 0
	for _, rows := range imports {
		if vers < rows.Version {
			err := migrator.MigrateTo(ctx, rows.Version)
			if err != nil {
				return 0, err
			}

			vers = rows.Version

			rowsWritten, err := WriteUnversionedDataToTable(ctx, tmpConn, rows.Name, rows.Rows)
			if err != nil {
				return 0, err
			}

			rowCount += rowsWritten
		}

		// time.Sleep(30 * time.Second)
	}

	err = migrator.Migrate(ctx)
	if err != nil {
		return 0, err
	}

	tmpCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	readDataIter := util.GoIter2(tmpCtx, func(yield func(*model.TableExport, error) bool) {
		tables, err := ListTables(tmpCtx, tmpConn)
		if err != nil {
			return
		}

		for _, table := range tables {
			export, err := ExportTableToJson(tmpCtx, tmpConn, table)
			if !yield(export, err) || err != nil {
				break
			}
		}
	})

	var secondRowCount int64 = 0
	for item, err := range readDataIter {
		if err != nil {
			break
		}

		// TODO use transactions
		rowCount, err := WriteUnversionedDataToTable(ctx, conn, item.Name, item.Rows)
		if err != nil {
			return secondRowCount, err
		}

		secondRowCount += rowCount
	}

	if secondRowCount != rowCount {
		fmt.Printf("rowCount %v != secondRowCount %v\n", rowCount, secondRowCount)
		panic("row counts don't equal each other")
	}

	return rowCount, nil
}
