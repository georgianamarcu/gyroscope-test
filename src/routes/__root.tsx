import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Suspense } from "react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {/* <Suspense>
        <TanStackRouterDevtools />
      </Suspense> */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  ),
});
