import { createLazyFileRoute } from "@tanstack/react-router";
import Experience from "@/components/Experience";

export const Route = createLazyFileRoute("/experience")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Experience />
    </>
  );
}
