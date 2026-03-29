import { describe, expect, it } from "vitest";

import { appRoutes } from "../../src/app-routes";
import { createDocumentationRoutes } from "../../src/documentation-config";

describe("app route definitions", () => {
  it("keeps the documentation sections stable and ends with an explicit fallback route", () => {
    expect(appRoutes.map((route) => route.path)).toEqual([
      "/",
      "/getting-started",
      "/guides",
      "/examples",
      "/api",
      "/tooling",
      "/packages",
      "*",
    ]);
    expect(appRoutes.at(-1)?.name).toBe("documentation-not-found");
  });

  it("assigns unique names and renderable metadata to each final route", () => {
    const names = new Set<string>();

    for (const route of appRoutes) {
      expect(route.name).toBeTruthy();
      expect(route.componentTag).toBeTruthy();

      if (route.path !== "*") {
        expect(route.title).toBeTruthy();
        expect(route.description).toBeTruthy();
      }

      const routeName = route.name;

      if (!routeName) {
        throw new Error("Every route must declare a name.");
      }

      expect(names.has(routeName)).toBe(false);
      names.add(routeName);
    }
  });

  it("can generate embeddable docs routes with a prefixed base path", () => {
    const embeddedRoutes = createDocumentationRoutes({
      basePath: "/docs",
      includeFallback: false,
      pathStyle: "flat",
    });

    expect(embeddedRoutes.map((route) => route.path)).toEqual([
      "/docs",
      "/docs-getting-started",
      "/docs-guides",
      "/docs-examples",
      "/docs-api",
      "/docs-tooling",
      "/docs-packages",
    ]);
    expect(embeddedRoutes.some((route) => route.path === "*")).toBe(false);
  });
});
