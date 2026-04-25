import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type RouterCtorOptions = {
  outlet: HTMLElement;
  root: Document;
  routes: Array<{
    path: string;
    componentTag?: string;
  }>;
};

const outlet = {} as HTMLElement;
const currentRoute = {
  path: "/overview",
  fullPath: "/overview",
};

const { core, take, routerCtor, routerInit, setDocumentDescription } =
  vi.hoisted(() => {
    const take = vi.fn();
    const core = Object.assign(vi.fn(), { take });
    const routerInit = vi.fn();
    const setDocumentDescription = vi.fn();
    const routerCtor = vi.fn(function RouterCtor(options: RouterCtorOptions) {
      void options;

      return {
        getCurrentRoute: () => currentRoute,
        init: routerInit,
      };
    });

    return {
      core,
      take,
      routerCtor,
      routerInit,
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
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("registers the standalone shell and generic documentation components, then boots the router", async () => {
    await import("../../src/main");

    expect(take).toHaveBeenCalledTimes(4);
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-standalone-shell",
    );
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-layout",
    );
    expect(take).toHaveBeenCalledWith(expect.anything(), "documentation-page");
    expect(take).toHaveBeenCalledWith(
      expect.anything(),
      "documentation-not-found-page",
    );
    expect(core).toHaveBeenCalledTimes(1);

    expect(routerCtor).toHaveBeenCalledTimes(1);
    const [routerOptions] = routerCtor.mock.calls[0] ?? [];

    expect(routerOptions?.routes).toEqual(
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
          path: "/core-concepts/lifecycle",
          componentTag: "documentation-page",
        }),
        expect.objectContaining({
          path: "*",
          componentTag: "documentation-not-found-page",
        }),
      ]),
    );

    expect(routerInit).toHaveBeenCalledTimes(1);
  });
});
