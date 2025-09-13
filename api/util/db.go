package util

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetPgx() (*pgxpool.Pool, error) {
	db := os.Getenv("POSTGRES_DB")
	return GetPgxDatabase(db)
}

func GetPgxDatabase(database string) (*pgxpool.Pool, error) {
	host := os.Getenv("POSTGRES_HOST")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")

	dbUrl := fmt.Sprintf("postgresql://%s:%s@%s/%s",
		user,
		password,
		host,
		database,
	)

	L.Info().Str("dbUrl", dbUrl).Msg("failed to connect to pool")

	return pgxpool.New(context.Background(), dbUrl)
}
