import { describe, expect, it } from "vitest";

import { appRoutes } from "../../src/app-routes";
import {
  createDocumentationRoutes,
  getDocumentationNavigationItems,
} from "../../src/documentation-config";

describe("documentation routes", () => {
  it("exposes the required standalone route tree and explicit fallback", () => {
    expect(appRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/",
          redirectTo: { name: "documentation-overview" },
        }),
        expect.objectContaining({
          path: "/overview",
          componentTag: "documentation-page",
        }),
        expect.objectContaining({
          path: "/getting-started/installation",
          componentTag: "documentation-page",
        }),
        expect.objectContaining({
          path: "/core-concepts/lifecycle",
          componentTag: "documentation-page",
        }),
        expect.objectContaining({
          path: "/migration",
          componentTag: "documentation-page",
        }),
        expect.objectContaining({
          path: "*",
          name: "documentation-not-found",
          componentTag: "documentation-not-found-page",
        }),
      ]),
    );
  });

  it("can generate the embedded website route tree under /docs", () => {
    const embeddedRoutes = createDocumentationRoutes({
      basePath: "/docs",
      includeFallback: false,
    });

    expect(embeddedRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/docs",
          redirectTo: { name: "documentation-overview" },
        }),
        expect.objectContaining({ path: "/docs/overview" }),
        expect.objectContaining({
          path: "/docs/getting-started/project-structure",
        }),
        expect.objectContaining({ path: "/docs/api" }),
      ]),
    );
    expect(embeddedRoutes.some((route) => route.path === "*")).toBe(false);
  });

  it("builds nested navigation items for the docs shell", () => {
    const navigationItems = getDocumentationNavigationItems();
    const gettingStarted = navigationItems.find(
      (item) => item.path === "/getting-started",
    );

    expect(navigationItems[0]?.path).toBe("/overview");
    expect(gettingStarted?.children.map((item) => item.path)).toEqual([
      "/getting-started/installation",
      "/getting-started/project-structure",
      "/getting-started/first-component",
      "/getting-started/manual-setup",
    ]);
  });
});
