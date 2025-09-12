package dbcopy

import (
	"context"
	"encoding/json"
	"fmt"

	"a1liu.com/data/api/model"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/tern/v2/migrate"
)

func ExportTableToJson(
	ctx context.Context,
	pool *pgxpool.Pool,
	table string,
) (*model.TableExport, error) {
	conn, err := pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	migrator, err := migrate.NewMigrator(ctx, conn.Conn(), VersionTable)
	if err != nil {
		return nil, err
	}
	version, err := migrator.GetCurrentVersion(ctx)
	if err != nil {
		return nil, err
	}

	rows, _ := conn.Query(ctx, fmt.Sprintf(`
 	SELECT to_jsonb(t) FROM "%v";
	`, table))

	export := &model.TableExport{
		Name:    table,
		Version: version,
		Rows:    make([]map[string]any, 128)[:0],
	}
	for rows.Next() {
		var jsonRow []byte
		err := rows.Scan(&jsonRow)
		if err != nil {
			break
		}

		var jsonMap map[string]any
		json.Unmarshal(jsonRow, &jsonMap)
		export.Rows = append(export.Rows, jsonMap)

	}

	return export, rows.Err()
}
