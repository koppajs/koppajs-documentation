export type EcosystemPackage = {
  readonly key: "core" | "router" | "vite-plugin" | "documentation";
  readonly name: string;
  readonly href: string;
  readonly docsPath: string;
  readonly role: string;
  readonly summary: string;
  readonly responsibilities: readonly string[];
  readonly installCommand?: string;
};

export const ecosystemPackages: readonly EcosystemPackage[] = [
  {
    key: "core",
    name: "@koppajs/koppajs-core",
    href: "https://github.com/koppajs/koppajs-core",
    docsPath: "/api",
    role: "Runtime",
    summary:
      "Registers components, installs plugins or modules, and boots the application with an intentionally small public contract.",
    responsibilities: [
      "Component registration through Core.take(...).",
      "One-time application bootstrap through Core().",
      "Lifecycle coordination, reactive state wiring, and component execution.",
    ],
    installCommand: "pnpm add @koppajs/koppajs-core",
  },
  {
    key: "router",
    name: "@koppajs/koppajs-router",
    href: "https://github.com/koppajs/koppajs-router",
    docsPath: "/routing",
    role: "Navigation",
    summary:
      "Owns deterministic route matching, browser history integration, active-link state, redirects, and outlet rendering.",
    responsibilities: [
      "Static, dynamic, nested, and fallback route matching.",
      "Named route resolution and browser path generation.",
      "Metadata updates, active-link synchronization, and scroll handling.",
    ],
    installCommand: "pnpm add @koppajs/koppajs-router",
  },
  {
    key: "vite-plugin",
    name: "@koppajs/koppajs-vite-plugin",
    href: "https://github.com/koppajs/koppajs-vite-plugin",
    docsPath: "/tooling",
    role: "Build pipeline",
    summary:
      "Transforms .kpa files into deterministic modules for the KoppaJS runtime without injecting runtime behavior.",
    responsibilities: [
      "Template, style, and script extraction from .kpa files.",
      "TypeScript, SCSS, and SASS transformation in the Vite pipeline.",
      "Stable module output consumed by @koppajs/koppajs-core.",
    ],
    installCommand: "pnpm add -D @koppajs/koppajs-vite-plugin",
  },
  {
    key: "documentation",
    name: "koppajs-documentation",
    href: "https://github.com/koppajs/koppajs-documentation",
    docsPath: "/architecture",
    role: "Documentation system",
    summary:
      "Runs as a standalone documentation app and exports the embeddable documentation contract consumed by the official website.",
    responsibilities: [
      "Navigation, route metadata, and route map generation for the docs surface.",
      "Shared product language and reference content across the public site and docs app.",
      "Embeddable documentation rendering without duplicating docs routing logic.",
    ],
  },
];
