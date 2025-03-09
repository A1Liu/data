package server

import (
	"net/http"

	"a1liu.com/data/api/graph"
	"a1liu.com/data/api/resolvers"
	"a1liu.com/data/api/util"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/vektah/gqlparser/v2/ast"
)

func CreateGqlServer() http.Handler {
	pool, err := resolvers.GetPgx()
	if err != nil {
		util.L.Err(err).Msg("failed to connect to pool")

		panic("failed to connect to pool")
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &resolvers.Resolver{}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	handler := resolvers.Middleware(pool, srv)

	return handler
}
