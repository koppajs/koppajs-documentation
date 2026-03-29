import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type RouterCtorOptions = {
  outlet: HTMLElement;
  root: Document;
  routes: Array<{
    path: string;
    componentTag: string;
  }>;
};

const outlet = {} as HTMLElement;
const currentRoute = {
  path: "/",
  fullPath: "/",
};

const {
  core,
  take,
  routerCtor,
  routerInit,
  routerNavigate,
  setDocumentDescription,
} = vi.hoisted(() => {
  const take = vi.fn();
  const core = Object.assign(vi.fn(), { take });
  const routerInit = vi.fn();
  const routerNavigate = vi.fn();
  const setDocumentDescription = vi.fn();
  const routerCtor = vi.fn(function RouterCtor(options: RouterCtorOptions) {
    void options;

    return {
      getCurrentRoute: () => currentRoute,
      init: routerInit,
      navigate: routerNavigate,
    };
  });

  return {
    core,
    take,
    routerCtor,
    routerInit,
    routerNavigate,
    setDocumentDescription,
  };
});

vi.mock("@koppajs/koppajs-core", () => ({
  Core: core,
}));

vi.mock("@koppajs/koppajs-router", () => ({
  KOPPAJS_ROUTE_CHANGE_EVENT: "koppajs-route-change",
  KoppajsRouter: routerCtor,
  setDocumentDescription,
}));

describe("main bootstrap", () => {
  const querySelector = vi.fn((selector: string) =>
    selector === "#app-outlet" ? outlet : null,
  );
  const requestAnimationFrame = vi.fn();
  const addEventListener = vi.fn();

  beforeEach(() => {
    querySelector.mockImplementation((selector: string) =>
      selector === "#app-outlet" ? outlet : null,
    );
    requestAnimationFrame.mockReset();
    addEventListener.mockReset();

    vi.stubGlobal("document", {
      documentElement: {
        lang: "en",
      },
      querySelector,
      title: "",
    } as unknown as Document);
    vi.stubGlobal("window", {
      addEventListener,
      requestAnimationFrame,
    } as unknown as Window);
  });

  afterEach(() => {
    core.mockClear();
    take.mockClear();
    routerCtor.mockClear();
    routerInit.mockClear();
    routerNavigate.mockClear();
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("registers the standalone shell, documentation components, and pages, then boots the router once", async () => {
    await import("../../src/main");

    expect(take).toHaveBeenCalledTimes(18);
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-standalone-shell",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-layout",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-home-page-de",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-home-page",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-not-found-page-de",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-not-found-page",
    );
    expect(core).toHaveBeenCalledTimes(1);

    expect(routerCtor).toHaveBeenCalledTimes(1);
    const [routerOptions] = routerCtor.mock.calls[0] ?? [];

    expect(routerOptions).toBeDefined();
    expect(routerOptions?.outlet).toBe(outlet);
    expect(routerOptions?.root).toBe(globalThis.document);
    expect(
      routerOptions?.routes.map((route) => ({
        path: route.path,
        componentTag: route.componentTag,
      })),
    ).toEqual([
      { path: "/", componentTag: "documentation-home-page" },
      {
        path: "/getting-started",
        componentTag: "documentation-getting-started-page",
      },
      { path: "/guides", componentTag: "documentation-guides-page" },
      { path: "/examples", componentTag: "documentation-examples-page" },
      { path: "/api", componentTag: "documentation-api-page" },
      { path: "/tooling", componentTag: "documentation-tooling-page" },
      { path: "/packages", componentTag: "documentation-packages-page" },
      { path: "*", componentTag: "documentation-not-found-page" },
    ]);

    expect(routerInit).toHaveBeenCalledTimes(1);
  });
});
