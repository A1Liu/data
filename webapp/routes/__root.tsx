import {
  createRootRoute,
  Link,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.ico" }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
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
        <Toaster />
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
