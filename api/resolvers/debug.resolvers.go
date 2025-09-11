package resolvers

import (
	"context"

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
	rctx := ctx.Value(resolverCtxKey).(*ResolverCtx)

	return dbcopy.ListTables(ctx, rctx.Pool)
}
