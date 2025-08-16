import { useState } from "react";
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const rootRoute = createRootRoute({
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

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    const [count, setCount] = useState(0);

    return (
      <>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    );
  },
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const Router = createRouter({ routeTree });

function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
