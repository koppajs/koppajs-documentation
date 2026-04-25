import type { KoppajsRouter, RouteDefinition } from "@koppajs/koppajs-router";

type RedirectAwareRouter = Pick<
  KoppajsRouter<RouteDefinition>,
  "getCurrentRoute" | "navigate"
>;

export const normalizeRedirectedRouteUrl = (
  router: RedirectAwareRouter,
): void => {
  const currentRoute = router.getCurrentRoute();

  if (!currentRoute.redirectedFrom) {
    return;
  }

  router.navigate(currentRoute.fullPath, {
    replace: true,
    scroll: false,
  });
};
