package resolvers

import (
	"context"
	"fmt"

	"a1liu.com/data/api/graph"
	"a1liu.com/data/api/model"
)

type queryResolver struct{ *Resolver }

// Query returns graph.QueryResolver implementation.
func (r *Resolver) Query() graph.QueryResolver { return &queryResolver{r} }

// Dummy is the resolver for the dummy field.
func (r *queryResolver) Dummy(ctx context.Context) (*bool, error) {
	panic(fmt.Errorf("not implemented: Dummy - dummy"))
}

func (r *queryResolver) SessionUser(ctx context.Context) (*model.User, error) {
	return nil, nil
}

// Todos is the resolver for the todos field.
func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	panic(fmt.Errorf("not implemented: Todos - todos"))
}
