import "./standalone.css";

import { Core } from "@koppajs/koppajs-core";
import {
  KoppajsRouter,
  KOPPAJS_ROUTE_CHANGE_EVENT,
  setDocumentDescription,
} from "@koppajs/koppajs-router";

import { registerStandaloneShell } from "./components/standalone";
import {
  createDocumentationRoutes,
  getDocumentationRouteMeta,
  installDocumentationRouteMap,
  registerDocumentation,
} from "./integration";
import {
  getKoppaLocale,
  KOPPAJS_LOCALE_CHANGE_EVENT,
  syncKoppaDocumentLanguage,
} from "./i18n";

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
    routes: createDocumentationRoutes({ locale: getKoppaLocale() }),
    outlet,
    root: document,
    basePath: import.meta.env.BASE_URL,
    scrollBehavior: "auto",
  });

  router.init();
  syncDocumentationMetadata(router.getCurrentRoute().path);

  if ("addEventListener" in window) {
    window.addEventListener(KOPPAJS_ROUTE_CHANGE_EVENT, (event) => {
      syncDocumentationMetadata(
        (event as CustomEvent<{ path?: string }>).detail?.path ??
          router.getCurrentRoute().path,
      );
    });

    window.addEventListener(KOPPAJS_LOCALE_CHANGE_EVENT, () => {
      const currentRoute = router.getCurrentRoute();

      router.navigate(currentRoute.fullPath, { replace: true, scroll: false });
      syncDocumentationMetadata(currentRoute.path);
    });
  }
}

function syncDocumentationMetadata(path: string): void {
  const metadata = getDocumentationRouteMeta(path, getKoppaLocale());

  document.title = metadata.title;
  setDocumentDescription(document, metadata.description);
  syncKoppaDocumentLanguage(document);
}
