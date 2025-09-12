package resolvers

import (
	"context"
	"encoding/json"

	"a1liu.com/data/api/graph"
	"a1liu.com/data/api/model"
	"a1liu.com/data/api/util/dbcopy"
)

type debugQueryResolver struct{}

func (r *queryResolver) Debug(ctx context.Context) (*model.DebugQuery, error) {
	return &model.DebugQuery{}, nil
}

func (r *Resolver) DebugQuery() graph.DebugQueryResolver {
	return debugQueryResolver{}
}

func (d debugQueryResolver) ListTables(ctx context.Context, obj *model.DebugQuery) ([]string, error) {
	rctx := ResCtx(ctx)

	return dbcopy.ListTables(ctx, rctx.Pool)
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

	rowCount, err := dbcopy.WriteUnversionedDataToTable(ctx, rctx.Pool, table, data)
	return float64(rowCount), err
}
