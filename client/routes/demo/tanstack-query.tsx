import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "../../trpc";

export const Route = createFileRoute("/demo/tanstack-query")({
  component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
  const { data, isLoading, error } = trpc.health.useQuery();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          "radial-gradient(50% 50% at 95% 5%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)",
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h1 className="text-2xl mb-4">tRPC + Prisma health</h1>
        {isLoading ? (
          <p className="text-white/80">Loading…</p>
        ) : error ? (
          <pre className="text-red-300 whitespace-pre-wrap">
            {error.message}
          </pre>
        ) : (
          <pre className="text-white/90 whitespace-pre-wrap text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
