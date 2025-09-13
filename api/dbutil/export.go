package dbutil

import (
	"context"
	"encoding/json"
	"fmt"

	"a1liu.com/data/api/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ExportTableToJson(
	ctx context.Context,
	conn *pgxpool.Conn,
	table string,
) (*model.TableExport, error) {
	migrator, err := Migrator(ctx, conn)
	if err != nil {
		return nil, err
	}
	version, err := migrator.GetCurrentVersion(ctx)
	if err != nil {
		return nil, err
	}

	rows, _ := conn.Query(ctx, fmt.Sprintf(`
 	SELECT to_jsonb(t) FROM "%v" t;
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
