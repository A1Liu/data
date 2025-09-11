package dbcopy

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

func ListTables(ctx context.Context, pool *pgxpool.Pool) ([]string, error) {
	conn, err := pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	rows, err := conn.Query(ctx, `
 		SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE';
	`)
	if err != nil {
		return nil, err

	}

	defer rows.Close()

	return []string{"hello"}, nil
}
