import type { RouteDefinition } from "@koppajs/koppajs-router";

const brand = "KoppaJS Documentation";

export const appRoutes = [
  {
    path: "/",
    name: "home",
    title: `${brand} · Overview`,
    description:
      "Canonical KoppaJS documentation website with a routed application shell and package guidance.",
    componentTag: "home-page",
  },
  {
    path: "/getting-started",
    name: "getting-started",
    title: `${brand} · Getting Started`,
    description:
      "Bootstrap the documentation website locally with Vite, KoppaJS core, and the official router.",
    componentTag: "getting-started-page",
  },
  {
    path: "/packages",
    name: "packages",
    title: `${brand} · Package Map`,
    description:
      "See how koppajs-core, koppajs-vite-plugin, and koppajs-router divide responsibilities.",
    componentTag: "packages-page",
  },
  {
    path: "/testing",
    name: "testing",
    title: `${brand} · Testing`,
    description:
      "Vitest, Playwright, and CI define the verification baseline for this documentation website.",
    componentTag: "testing-page",
  },
  {
    path: "*",
    name: "not-found",
    title: `${brand} · Not Found`,
    description: "Fallback route for unmatched documentation paths.",
    componentTag: "not-found-page",
  },
] satisfies readonly RouteDefinition[];
