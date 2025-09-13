package dbutil

import (
	"context"

	"a1liu.com/data/api/migrations"
	"a1liu.com/data/api/model"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/tern/v2/migrate"
)

const VersionTableName = "schema_version"
const VersionTable = "public." + VersionTableName

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
    AND table_type = 'BASE TABLE' AND table_name <> $1;
	`, VersionTableName)
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

func Migrator(ctx context.Context, conn *pgxpool.Conn) (*migrate.Migrator, error) {
	migrator, err := migrate.NewMigrator(ctx, conn.Conn(), VersionTable)
	if err != nil {
		return nil, err
	}

	err = migrator.LoadMigrations(migrations.Files)
	if err != nil {
		return nil, err
	}

	return migrator, err
}
