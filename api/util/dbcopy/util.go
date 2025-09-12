package dbcopy

import (
	"context"

	"a1liu.com/data/api/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

const VersionTable = "public.schema_version"

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

func ListTableColumns(ctx context.Context, conn *pgxpool.Conn, table string) ([]model.PgColumn, error) {
	rows, _ := conn.Query(ctx, `
 		SELECT column_name, data_type
  	FROM information_schema.columns
 		WHERE table_schema = 'public'
   		AND table_name   = $1
 		order by ordinal_position
    ;
	`, table)
	defer rows.Close()

	names := make([]model.PgColumn, 16)[:0]
	for rows.Next() {
		var col model.PgColumn
		rows.Scan(&col.Name, &col.DataTypeName)
		names = append(names, col)
	}

	return names, rows.Err()
}
