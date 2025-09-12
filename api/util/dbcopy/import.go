package dbcopy

import (
	"context"
	"fmt"
	"strings"

	// "github.com/jackc/pgx/v5/pgtype"
	// "github.com/jackc/tern/v2/migrate"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TableImport struct {
	TableName    string
	TableVersion int
	Rows         []map[string]any
}

func ListTables(ctx context.Context, pool *pgxpool.Pool) ([]string, error) {
	conn, err := pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	rows, _ := conn.Query(ctx, `
 		SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
	`)
	defer rows.Close()

	names := make([]string, 16)[:0]
	for rows.Next() {
		var name string
		rows.Scan(&name)
		names = append(names, name)
	}

	return names, rows.Err()
}

type PgCol struct {
	Name string
	Type string
}

func ListTableColumnNames(ctx context.Context, conn *pgxpool.Conn, table string) ([]PgCol, error) {
	rows, _ := conn.Query(ctx, `
 		SELECT column_name, data_type
  	FROM information_schema.columns
 		WHERE table_schema = 'public'
   		AND table_name   = $1
 		order by ordinal_position
    ;
	`, table)
	defer rows.Close()

	names := make([]PgCol, 16)[:0]
	for rows.Next() {
		var col PgCol
		rows.Scan(&col.Name, &col.Type)
		names = append(names, col)
	}

	return names, rows.Err()

}

func WriteUnversionedDataToTable(
	ctx context.Context,
	pool *pgxpool.Pool,
	table string,
	rows []map[string]any,
) (int64, error) {
	if len(rows) == 0 {
		return 0, nil
	}

	conn, err := pool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Release()

	// TODO: cache this
	columns, err := ListTableColumnNames(ctx, conn, table)
	if err != nil {
		return 0, err
	}

	// columnize rows
	rowCols := len(columns)
	rowMap := make(map[string][]any, rowCols)
	for _, col := range columns {
		rowMap[col.Name] = make([]any, len(rows))
	}

	for idx, row := range rows {
		for key, value := range row {
			rowMap[key][idx] = value
		}
	}

	escaped := make([]string, len(columns))[:0]
	named := make([]string, len(columns))[:0]
	for _, c := range columns {
		escaped = append(escaped, fmt.Sprintf(`"%v"`, c.Name))
		named = append(named, fmt.Sprintf("@%v::%v[]", c.Name, c.Type))
	}

	// TODO string sanitization

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

	// Don't even worry about type safety. It'll be handled at the DB layer anyways.
	fmt.Println(query)

	args := pgx.NamedArgs{}
	for k, v := range rowMap {
		args[k] = v
	}

	tag, err := conn.Exec(ctx, query, args)
	return tag.RowsAffected(), err
}

func WriteTableImports(imports []TableImport) (int, error) {
	// migrate.ExtractErrorLine
	// TODO later: Use tern to handle versioned data
	return 0, nil
}
