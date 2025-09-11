import { createFileRoute } from "@tanstack/react-router";
import { ApolloSandbox } from "@apollo/sandbox/react";

export const Route = createFileRoute("/debug")({
  component: RouteComponent,
});

const INIT_DOC = `query Example {
  sessionUser {
    name
  }
}`;

function RouteComponent() {
  return (
    <ApolloSandbox
      className="w-full h-full"
      initialEndpoint="http://localhost:8080/graphql"
      initialState={{
        document: INIT_DOC,
        variables: {},
      }}
    />
  );
}
