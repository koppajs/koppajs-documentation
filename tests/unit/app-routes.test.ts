import { describe, expect, it } from "vitest";

import { appRoutes } from "../../src/app-routes";

describe("app route definitions", () => {
  it("keeps the documentation sections stable and ends with an explicit fallback route", () => {
    expect(appRoutes.map((route) => route.path)).toEqual([
      "/",
      "/getting-started",
      "/packages",
      "/testing",
      "*",
    ]);
    expect(appRoutes.at(-1)?.name).toBe("not-found");
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
});
