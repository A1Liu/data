package resolvers

import (
	"context"
	"encoding/json"

	"a1liu.com/data/api/dbutil"
	"a1liu.com/data/api/graph"
	"a1liu.com/data/api/model"
)

type debugQueryResolver struct{}

func (r *queryResolver) Debug(ctx context.Context) (*model.DebugQuery, error) {
	return &model.DebugQuery{}, nil
}

func (r *Resolver) DebugQuery() graph.DebugQueryResolver {
	return debugQueryResolver{}
}

func (d debugQueryResolver) Tables(ctx context.Context, obj *model.DebugQuery) ([]model.PgTable, error) {
	rctx := ResCtx(ctx)

	conn, err := rctx.Pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	names, err := dbutil.ListTables(ctx, conn)
	tables := make([]model.PgTable, len(names))
	for idx, name := range names {
		tables[idx] = model.PgTable{Name: name}
	}

	return tables, err
}

type debugMutationResolver struct{}

func (r *mutationResolver) Debug(ctx context.Context) (*model.DebugMutation, error) {
	return &model.DebugMutation{}, nil
}

func (r *Resolver) DebugMutation() graph.DebugMutationResolver {
	return debugMutationResolver{}
}

func (d debugMutationResolver) WriteRawData(ctx context.Context, obj *model.DebugMutation, table string, jsonString string) (float64, error) {
	rctx := ResCtx(ctx)

	var data []map[string]any
	err := json.Unmarshal([]byte(jsonString), &data)
	if err != nil {
		return 0, err
	}

	conn, err := rctx.Pool.Acquire(ctx)
	if err != nil {
		return 0, err
	}
	defer conn.Release()

	rowCount, err := dbutil.WriteUnversionedDataToTable(ctx, conn, table, data)
	return float64(rowCount), err
}

// WriteTables implements graph.DebugMutationResolver.
func (d debugMutationResolver) WriteTables(ctx context.Context, obj *model.DebugMutation, tables []model.TableImportInput) (float64, error) {
	rctx := ResCtx(ctx)

	rowCount, err := dbutil.WriteTableImports(ctx, rctx.Pool, tables)
	return float64(rowCount), err
}

type pgTableResolver struct{}

func (r *Resolver) PgTable() graph.PgTableResolver { return pgTableResolver{} }

func (p pgTableResolver) Columns(ctx context.Context, obj *model.PgTable) ([]model.PgColumn, error) {
	rctx := ResCtx(ctx)

	conn, err := rctx.Pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	return dbutil.ListTableColumns(ctx, conn, obj.Name)
}

func (p pgTableResolver) DumbFullExport(ctx context.Context, obj *model.PgTable) (*model.TableExport, error) {
	rctx := ResCtx(ctx)

	conn, err := rctx.Pool.Acquire(ctx)
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	return dbutil.ExportTableToJson(ctx, conn, obj.Name)
}
