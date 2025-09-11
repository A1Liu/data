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
      <h1>Vite + React</h1>
      <div className="card">
        <button className="btn" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Layout>
  );
}
