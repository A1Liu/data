import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../layout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);

  return (
    <Layout>
      <h1>Data</h1>
      <div className="card">
        <button className="btn" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </Layout>
  );
}
