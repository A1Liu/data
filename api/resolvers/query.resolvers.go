package resolvers

import (
	"context"

	"a1liu.com/data/api/graph"
	"a1liu.com/data/api/model"
)

type queryResolver struct{ *Resolver }

// Query returns graph.QueryResolver implementation.
func (r *Resolver) Query() graph.QueryResolver { return &queryResolver{r} }

func (r *queryResolver) SessionUser(ctx context.Context) (*model.User, error) {
	return nil, nil
}
