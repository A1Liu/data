import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="">
      <div className="p-2 flex gap-2">
        <Link to="/" className="font-light [&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/ranges" className="font-light [&.active]:font-bold">
          Ranges
        </Link>
      </div>

      <hr />

      <div className="p-8 mx-auto text-center max-w-[1280px]">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
});
