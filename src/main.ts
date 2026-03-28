import "./style.css";

import { Core } from "@koppajs/koppajs-core";
import {
  KOPPAJS_ROUTE_CHANGE_EVENT,
  KoppajsRouter,
} from "@koppajs/koppajs-router";

import { appRoutes } from "./app-routes";
import { registerComponents } from "./components";
import { registerPages } from "./pages";

const ROUTE_LINK_SELECTOR = "a[data-route]";

let routerStarted = false;

registerComponents();
registerPages();
Core();

bootRouter();

function bootRouter(): void {
  if (routerStarted) {
    return;
  }

  const outlet = document.querySelector<HTMLElement>("#app-outlet");

  if (!outlet) {
    window.requestAnimationFrame(bootRouter);
    return;
  }

  routerStarted = true;

  const router = new KoppajsRouter({
    routes: appRoutes,
    outlet,
    root: document,
    basePath: import.meta.env.BASE_URL,
  });

  const syncRouteLinks = (): void => {
    document
      .querySelectorAll<HTMLAnchorElement>(ROUTE_LINK_SELECTOR)
      .forEach((link) => {
        const routeTarget = link.getAttribute("data-route");

        if (!routeTarget) {
          return;
        }

        link.setAttribute("href", router.hrefFor(routeTarget));
      });
  };

  window.addEventListener(KOPPAJS_ROUTE_CHANGE_EVENT, syncRouteLinks);

  router.init();
  syncRouteLinks();
}
