package resolvers

import (
	"context"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/vikstrous/dataloadgen"
)

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

const resolverCtxKey = "RESOLVER_CTX"

type ResolverCtx struct {
	Pool    *pgxpool.Pool
	Loaders Loaders
}

// ResCtx returns the dataloader for a given context
func ResCtx(ctx context.Context) *ResolverCtx {
	return ctx.Value(resolverCtxKey).(*ResolverCtx)
}

// Loaders wrap your data loaders to inject via middleware
type Loaders struct {
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders(conn *pgxpool.Conn) *Loaders {
	// define the data loader
	return &Loaders{}
}

// Middleware injects data loaders into the context
func Middleware(conn *pgxpool.Pool, next http.Handler) http.Handler {
	// return a middleware that injects the loader to the request context
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		resolverCtx := &ResolverCtx{
			Pool: conn,
		}

		r = r.WithContext(context.WithValue(ctx, resolverCtxKey, resolverCtx))
		next.ServeHTTP(w, r)
	})
}
