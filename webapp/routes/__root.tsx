import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="w-full h-full flex flex-col">
      <div className="p-2 flex gap-2">
        <Link to="/" className="font-light [&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/ranges" className="font-light [&.active]:font-bold">
          Ranges
        </Link>
        <Link to="/debug" className="font-light [&.active]:font-bold">
          Debug
        </Link>
      </div>

      <hr />

      <div className="flex-grow">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  ),
});
