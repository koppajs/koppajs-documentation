import type { RouteDefinition } from "@koppajs/koppajs-router";

import {
  defaultKoppaLocale,
  getKoppaLocale,
  normalizeKoppaLocale,
  type KoppaLocale,
} from "./i18n";

type DocumentationEntry = {
  readonly path: string;
  readonly label: string;
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly componentTag: string;
};

type DocumentationEntryDefinition = {
  readonly path: string;
  readonly name: string;
  readonly componentTag: string;
  readonly copy: Record<
    KoppaLocale,
    {
      readonly label: string;
      readonly title: string;
      readonly description: string;
    }
  >;
};

type CreateDocumentationRoutesOptions = {
  basePath?: string;
  includeFallback?: boolean;
  pathStyle?: "nested" | "flat";
  locale?: KoppaLocale;
};

type DocumentationRouteMap = Record<string, string>;

declare global {
  interface Window {
    __KOPPAJS_DOCUMENTATION_ROUTE_MAP__?: DocumentationRouteMap;
  }
}

const documentationBrandByLocale = {
  en: "KoppaJS Documentation",
  de: "KoppaJS Dokumentation",
} as const satisfies Record<KoppaLocale, string>;

const documentationEntryDefinitions = [
  {
    path: "/",
    name: "documentation-home",
    componentTag: "documentation-home-page",
    copy: {
      en: {
        label: "Overview",
        title: `${documentationBrandByLocale.en} · Overview`,
        description:
          "Complete KoppaJS user documentation for getting started, guides, API, tooling, and examples.",
      },
      de: {
        label: "Überblick",
        title: `${documentationBrandByLocale.de} · Überblick`,
        description:
          "Vollständige KoppaJS-Benutzerdokumentation für Einstieg, Guides, API, Tooling und Beispiele.",
      },
    },
  },
  {
    path: "/getting-started",
    name: "documentation-getting-started",
    componentTag: "documentation-getting-started-page",
    copy: {
      en: {
        label: "Getting started",
        title: `${documentationBrandByLocale.en} · Getting started`,
        description:
          "CLI scaffolding, manual Vite integration, project structure, and the essential scripts.",
      },
      de: {
        label: "Schnellstart",
        title: `${documentationBrandByLocale.de} · Schnellstart`,
        description:
          "Projektanlage per CLI, manuelle Vite-Integration, Projektstruktur und zentrale Scripts.",
      },
    },
  },
  {
    path: "/guides",
    name: "documentation-guides",
    componentTag: "documentation-guides-page",
    copy: {
      en: {
        label: "Guides",
        title: `${documentationBrandByLocale.en} · Guides`,
        description:
          "Core concepts, .kpa files, state, template syntax, events, props, slots, and lifecycle.",
      },
      de: {
        label: "Guides",
        title: `${documentationBrandByLocale.de} · Guides`,
        description:
          "Grundkonzepte, .kpa-Dateien, State, Template-Syntax, Events, Props, Slots und Lifecycle.",
      },
    },
  },
  {
    path: "/examples",
    name: "documentation-examples",
    componentTag: "documentation-examples-page",
    copy: {
      en: {
        label: "Examples",
        title: `${documentationBrandByLocale.en} · Examples`,
        description:
          "Practical code samples and a complete todo app with multiple components.",
      },
      de: {
        label: "Beispiele",
        title: `${documentationBrandByLocale.de} · Beispiele`,
        description:
          "Praxisnahe Codebeispiele und eine vollständige Todo-App mit mehreren Komponenten.",
      },
    },
  },
  {
    path: "/api",
    name: "documentation-api",
    componentTag: "documentation-api-page",
    copy: {
      en: {
        label: "API",
        title: `${documentationBrandByLocale.en} · API`,
        description:
          "Core API, return object, context variables, directives, loop metadata, and current limitations.",
      },
      de: {
        label: "API",
        title: `${documentationBrandByLocale.de} · API`,
        description:
          "Core API, Return-Objekt, Kontextvariablen, Direktiven, Loop-Variablen und Einschränkungen.",
      },
    },
  },
  {
    path: "/tooling",
    name: "documentation-tooling",
    componentTag: "documentation-tooling-page",
    copy: {
      en: {
        label: "Tooling",
        title: `${documentationBrandByLocale.en} · Tooling`,
        description:
          "Vite plugin, TypeScript, logger output, VS Code support, and the quality workflow around KoppaJS.",
      },
      de: {
        label: "Tooling",
        title: `${documentationBrandByLocale.de} · Tooling`,
        description:
          "Vite-Plugin, TypeScript, Logger, VS Code Extension und Qualitätsworkflow für KoppaJS.",
      },
    },
  },
  {
    path: "/packages",
    name: "documentation-packages",
    componentTag: "documentation-packages-page",
    copy: {
      en: {
        label: "Packages",
        title: `${documentationBrandByLocale.en} · Packages`,
        description:
          "How koppajs-core, koppajs-vite-plugin, create-koppajs, and the optional router divide responsibilities.",
      },
      de: {
        label: "Pakete",
        title: `${documentationBrandByLocale.de} · Pakete`,
        description:
          "Rollen von koppajs-core, koppajs-vite-plugin, create-koppajs und optionalem Router im Ökosystem.",
      },
    },
  },
] as const satisfies readonly DocumentationEntryDefinition[];

const documentationNotFoundCopy = {
  en: {
    title: `${documentationBrandByLocale.en} · Not found`,
    description: "Fallback route for unknown documentation paths.",
  },
  de: {
    title: `${documentationBrandByLocale.de} · Nicht gefunden`,
    description: "Fallback-Route für unbekannte Dokumentationspfade.",
  },
} as const satisfies Record<
  KoppaLocale,
  { readonly title: string; readonly description: string }
>;

const normalizePath = (path = "/"): string => {
  if (!path || path === "/") {
    return "/";
  }

  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

export const getDocumentationNavigationItems = (
  locale: KoppaLocale = defaultKoppaLocale,
): readonly DocumentationEntry[] => {
  const normalizedLocale = normalizeKoppaLocale(locale);

  return documentationEntryDefinitions.map((entry) => ({
    path: entry.path,
    name: entry.name,
    componentTag: entry.componentTag,
    ...entry.copy[normalizedLocale],
  }));
};

export const documentationNavigationItems = getDocumentationNavigationItems();

export const getDocumentationShellCopy = (
  locale: KoppaLocale = getKoppaLocale(),
) =>
  normalizeKoppaLocale(locale) === "de"
    ? {
        eyebrow: "KoppaJS",
        brandTitle: "Dokumentation",
        brandCopy:
          "Vollständige Benutzerdokumentation, standalone lauffähig und in eine Host-Website einbettbar.",
        navigationAriaLabel: "Dokumentationsnavigation",
        languageLabel: "Sprache",
        footerAriaLabel: "Wichtige Links",
        githubAriaLabel: "KoppaJS auf GitHub",
        docsAriaLabel: "koppajs-documentation Repository",
        websiteAriaLabel: "koppajs-website Repository",
        docsTitle: "Dokumentation",
        websiteTitle: "Website",
      }
    : {
        eyebrow: "KoppaJS",
        brandTitle: "Documentation",
        brandCopy:
          "Complete user documentation that runs standalone and can be embedded into a host website.",
        navigationAriaLabel: "Documentation navigation",
        languageLabel: "Language",
        footerAriaLabel: "Important links",
        githubAriaLabel: "Open KoppaJS on GitHub",
        docsAriaLabel: "koppajs-documentation repository",
        websiteAriaLabel: "koppajs-website repository",
        docsTitle: "Documentation",
        websiteTitle: "Website",
      };

export const normalizeDocumentationBasePath = (basePath = ""): string => {
  if (!basePath || basePath === "/") {
    return "";
  }

  return normalizePath(basePath);
};

export const withDocumentationBase = (basePath = "", path = "/"): string => {
  return withDocumentationBaseStyle(basePath, path, "nested");
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
    const suffix = normalizedPath.slice(1).replace(/\//g, "-");

    if (!normalizedBasePath) {
      return `/${suffix}`;
    }

    return `${normalizedBasePath}-${suffix}`;
  }

  return `${normalizedBasePath}${normalizedPath}`;
};

export const createDocumentationRouteMap = ({
  basePath = "",
  pathStyle = "nested",
}: Omit<
  CreateDocumentationRoutesOptions,
  "includeFallback" | "locale"
> = {}): DocumentationRouteMap =>
  documentationEntryDefinitions.reduce<DocumentationRouteMap>(
    (routeMap, entry) => {
      routeMap[entry.path] = withDocumentationBaseStyle(
        basePath,
        entry.path,
        pathStyle,
      );

      return routeMap;
    },
    {},
  );

export const installDocumentationRouteMap = (
  options: Omit<
    CreateDocumentationRoutesOptions,
    "includeFallback" | "locale"
  > = {},
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

export const getDocumentationRouteMeta = (
  path: string,
  locale: KoppaLocale = getKoppaLocale(),
): { title: string; description: string } => {
  const normalizedPath = normalizePath(path);
  const entry = getDocumentationNavigationItems(locale).find(
    (item) => item.path === normalizedPath,
  );

  if (entry) {
    return {
      title: entry.title,
      description: entry.description,
    };
  }

  return documentationNotFoundCopy[normalizeKoppaLocale(locale)];
};

export const createDocumentationRoutes = ({
  basePath = "",
  includeFallback = true,
  pathStyle = "nested",
  locale = getKoppaLocale(),
}: CreateDocumentationRoutesOptions = {}): readonly RouteDefinition[] => {
  const routes: RouteDefinition[] = getDocumentationNavigationItems(locale).map(
    (entry) => ({
      path: withDocumentationBaseStyle(basePath, entry.path, pathStyle),
      name: entry.name,
      title: entry.title,
      description: entry.description,
      componentTag: entry.componentTag,
    }),
  );

  if (includeFallback) {
    routes.push({
      path: "*",
      name: "documentation-not-found",
      ...documentationNotFoundCopy[normalizeKoppaLocale(locale)],
      componentTag: "documentation-not-found-page",
    });
  }

  return routes;
};
