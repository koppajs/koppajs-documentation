import type { RouteDefinition } from "@koppajs/koppajs-router";

import {
  documentationNavigationRootPaths,
  documentationPages,
  getDocumentationPage,
} from "./documentation-content";

export type DocumentationNavigationItem = {
  readonly path: string;
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly children: readonly DocumentationNavigationItem[];
};

type CreateDocumentationRoutesOptions = {
  basePath?: string;
  includeFallback?: boolean;
  pathStyle?: "nested" | "flat";
};

type DocumentationRouteMap = Record<string, string>;

declare global {
  interface Window {
    __KOPPAJS_DOCUMENTATION_ROUTE_MAP__?: DocumentationRouteMap;
  }
}

const DOCUMENTATION_BRAND = "KoppaJS Documentation";

const documentationNotFoundCopy = {
  title: `${DOCUMENTATION_BRAND} · Not found`,
  description: "Fallback route for unknown documentation paths.",
} as const;

const normalizePath = (path = "/"): string => {
  if (!path || path === "/") {
    return "/";
  }

  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

const getFlatPath = (path: string): string => {
  const normalized = normalizePath(path);

  if (normalized === "/") {
    return "/";
  }

  return `/${normalized.slice(1).replaceAll("/", "-")}`;
};

export const normalizeDocumentationBasePath = (basePath = ""): string => {
  if (!basePath || basePath === "/") {
    return "";
  }

  return normalizePath(basePath);
};

export const withDocumentationBaseStyle = (
  basePath = "",
  path = "/",
  pathStyle: "nested" | "flat" = "nested",
): string => {
  const normalizedBasePath = normalizeDocumentationBasePath(basePath);
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return normalizedBasePath || "/";
  }

  if (pathStyle === "flat") {
    const flatPath = getFlatPath(normalizedPath);

    if (!normalizedBasePath) {
      return flatPath;
    }

    return `${normalizedBasePath}${flatPath}`;
  }

  return `${normalizedBasePath}${normalizedPath}`;
};

export const withDocumentationBase = (basePath = "", path = "/"): string =>
  withDocumentationBaseStyle(basePath, path, "nested");

export const buildDocumentationPageTitle = (label: string): string =>
  `${DOCUMENTATION_BRAND} · ${label}`;

export const createDocumentationRouteMap = ({
  basePath = "",
  pathStyle = "nested",
}: Omit<
  CreateDocumentationRoutesOptions,
  "includeFallback"
> = {}): DocumentationRouteMap => {
  const routeMap: DocumentationRouteMap = {
    "/": withDocumentationBaseStyle(basePath, "/", pathStyle),
  };

  for (const page of documentationPages) {
    routeMap[page.path] = withDocumentationBaseStyle(
      basePath,
      page.path,
      pathStyle,
    );
  }

  return routeMap;
};

export const installDocumentationRouteMap = (
  options: Omit<CreateDocumentationRoutesOptions, "includeFallback"> = {},
): DocumentationRouteMap => {
  const routeMap = createDocumentationRouteMap(options);

  if (typeof window !== "undefined") {
    window.__KOPPAJS_DOCUMENTATION_ROUTE_MAP__ = routeMap;
  }

  return routeMap;
};

export const getDocumentationRouteMap = (): DocumentationRouteMap =>
  typeof window !== "undefined" && window.__KOPPAJS_DOCUMENTATION_ROUTE_MAP__
    ? window.__KOPPAJS_DOCUMENTATION_ROUTE_MAP__
    : createDocumentationRouteMap();

export const resolveDocumentationPath = (
  path: string,
  routeMap: DocumentationRouteMap = getDocumentationRouteMap(),
): string | null => {
  const normalized = normalizePath(path);

  if (normalized === "/") {
    return "/overview";
  }

  if (getDocumentationPage(normalized)) {
    return normalized;
  }

  const routeMatch = Object.entries(routeMap).find(
    ([, href]) => href === normalized,
  )?.[0];

  if (routeMatch) {
    return routeMatch === "/" ? "/overview" : routeMatch;
  }

  return null;
};

const getDocumentationPageByPath = (path: string) =>
  getDocumentationPage(resolveDocumentationPath(path) ?? path);

export const getDocumentationRouteMeta = (
  path: string,
): { title: string; description: string } => {
  const page = getDocumentationPageByPath(path);

  if (!page) {
    return documentationNotFoundCopy;
  }

  return {
    title: buildDocumentationPageTitle(page.label),
    description: page.description,
  };
};

const getChildPages = (path: string) =>
  documentationPages
    .filter(
      (
        page,
      ): page is (typeof documentationPages)[number] & { parentPath: string } =>
        "parentPath" in page && page.parentPath === path,
    )
    .sort((left, right) => left.navOrder - right.navOrder);

const buildNavigationItem = (
  path: string,
  routeMap: DocumentationRouteMap,
): DocumentationNavigationItem => {
  const page = getDocumentationPage(path);

  if (!page) {
    throw new Error(`Unknown documentation page: ${path}`);
  }

  return {
    path: page.path,
    href: routeMap[page.path] ?? page.path,
    label: page.label,
    description: page.description,
    children: getChildPages(path).map((child) =>
      buildNavigationItem(child.path, routeMap),
    ),
  };
};

export const getDocumentationNavigationItems = (
  options: Omit<CreateDocumentationRoutesOptions, "includeFallback"> = {},
): readonly DocumentationNavigationItem[] => {
  const routeMap =
    options.basePath !== undefined || options.pathStyle !== undefined
      ? createDocumentationRouteMap(options)
      : getDocumentationRouteMap();

  return documentationNavigationRootPaths.map((path) =>
    buildNavigationItem(path, routeMap),
  );
};

export const documentationNavigationItems = getDocumentationNavigationItems();

export const getDocumentationShellCopy = () => ({
  eyebrow: "KoppaJS",
  title: "Documentation",
  summary:
    "Standalone documentation with an embeddable route and navigation contract for the public website.",
  navigationLabel: "Documentation navigation",
});

export const createDocumentationRoutes = ({
  basePath = "",
  includeFallback = true,
  pathStyle = "nested",
}: CreateDocumentationRoutesOptions = {}): readonly RouteDefinition[] => {
  const routes: RouteDefinition[] = [
    {
      path: withDocumentationBaseStyle(basePath, "/", pathStyle),
      name: "documentation-root",
      redirectTo: { name: "documentation-overview" },
    },
    ...documentationPages.map((page) => ({
      path: withDocumentationBaseStyle(basePath, page.path, pathStyle),
      name: page.name,
      title: buildDocumentationPageTitle(page.label),
      description: page.description,
      componentTag: "documentation-page",
      meta: {
        documentationPath: page.path,
      },
    })),
  ];

  if (includeFallback) {
    routes.push({
      path: "*",
      name: "documentation-not-found",
      ...documentationNotFoundCopy,
      componentTag: "documentation-not-found-page",
    });
  }

  return routes;
};
