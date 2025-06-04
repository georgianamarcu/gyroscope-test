import Experience from "@/components/Experience";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Experience,
});
