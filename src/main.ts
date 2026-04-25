import "./standalone.css";

import { Core } from "@koppajs/koppajs-core";
import {
  KOPPAJS_ROUTE_CHANGE_EVENT,
  KoppajsRouter,
  setDocumentDescription,
} from "@koppajs/koppajs-router";

import { registerStandaloneShell } from "./components/standalone";
import {
  createDocumentationRoutes,
  getDocumentationRouteMeta,
  installDocumentationRouteMap,
  normalizeRedirectedRouteUrl,
  registerDocumentation,
} from "./integration";

let routerStarted = false;

registerStandaloneShell();
registerDocumentation();
installDocumentationRouteMap();
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
    routes: createDocumentationRoutes(),
    outlet,
    root: document,
    basePath: import.meta.env.BASE_URL,
    scrollBehavior: "auto",
  });

  router.init();
  normalizeRedirectedRouteUrl(router);
  syncDocumentationMetadata(router.getCurrentRoute().path);

  window.addEventListener(KOPPAJS_ROUTE_CHANGE_EVENT, (event) => {
    syncDocumentationMetadata(
      (event as CustomEvent<{ path?: string }>).detail?.path ??
        router.getCurrentRoute().path,
    );
  });
}

function syncDocumentationMetadata(path: string): void {
  const metadata = getDocumentationRouteMeta(path);

  document.title = metadata.title;
  document.documentElement.lang = "en";
  setDocumentDescription(document, metadata.description);
}
