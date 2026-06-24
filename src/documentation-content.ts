import { ecosystemPackages } from "./ecosystem";

export type DocumentationAction = {
  readonly label: string;
  readonly path: string;
  readonly variant?: "primary" | "secondary";
};

export type DocumentationTocItem = {
  readonly id: string;
  readonly label: string;
};

export type DocumentationPageDefinition = {
  readonly path: string;
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly lead: string;
  readonly actions?: readonly DocumentationAction[];
  readonly toc: readonly DocumentationTocItem[];
  readonly bodyHtml: string;
  readonly navOrder: number;
  readonly parentPath?: string;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const join = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join("\n");

const ic = (value: string): string =>
  `<code class="koppa-inline-code">${escapeHtml(value)}</code>`;

const docLink = (path: string, label: string): string =>
  `<a class="koppa-link" data-doc-path="${path}">${label}</a>`;

const section = (
  id: string,
  eyebrow: string,
  title: string,
  lead: string,
  content: string,
): string => `
  <section id="${id}" class="docs-section koppa-stack">
    <div class="docs-section__heading koppa-stack">
      <p class="koppa-eyebrow">${eyebrow}</p>
      <h2 class="docs-section__title">${title}</h2>
      <p class="koppa-text-muted docs-section__lead">${lead}</p>
    </div>
    ${content}
  </section>
`;

const card = (
  title: string,
  body: string,
  eyebrow?: string,
  footer?: string,
): string => `
  <article class="koppa-card koppa-card--quiet">
    ${eyebrow ? `<p class="koppa-eyebrow">${eyebrow}</p>` : ""}
    <h3>${title}</h3>
    <p class="koppa-text-muted">${body}</p>
    ${footer ? `<div>${footer}</div>` : ""}
  </article>
`;

const cardGrid = (columns: 2 | 3 | 4, ...items: string[]): string => `
  <div class="koppa-grid koppa-grid--${columns}">
    ${items.join("\n")}
  </div>
`;

const list = (items: readonly string[], ordered = false): string => {
  const tag = ordered ? "ol" : "ul";

  return `
    <${tag} class="koppa-list koppa-text-muted">
      ${items.map((item) => `<li>${item}</li>`).join("\n")}
    </${tag}>
  `;
};

const table = (
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string => `
  <div class="koppa-table-wrap">
    <table class="koppa-table">
      <thead>
        <tr>
          ${headers.map((header) => `<th>${header}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `,
          )
          .join("\n")}
      </tbody>
    </table>
  </div>
`;

const codeBlock = (label: string, language: string, source: string): string => `
  <div class="koppa-code-block" data-language="${language}">
    <div class="koppa-code-block__header">
      <span class="koppa-code-block__label">${label}</span>
      <button type="button" class="koppa-copy-button" data-copy-state="idle">Copy</button>
    </div>
    <pre><code>${escapeHtml(source)}</code></pre>
  </div>
`;

const callout = (title: string, body: string, muted = false): string => `
  <aside class="koppa-callout ${muted ? "koppa-callout--muted" : ""}">
    <h3>${title}</h3>
    <p>${body}</p>
  </aside>
`;

const packagesTableRows = ecosystemPackages.map((item) => [
  ic(item.name),
  item.role,
  item.summary,
  item.responsibilities.join("<br />"),
]);

export const documentationPages = [
  {
    path: "/overview",
    name: "documentation-overview",
    label: "Overview",
    description:
      "Start here after the product overview: package map, learning paths, runtime model, and technical documentation routes.",
    eyebrow: "KoppaJS Documentation",
    headline: "Understand how KoppaJS works before you wire an app.",
    lead: "The product site explains why KoppaJS exists. The documentation explains how the runtime, Components, router, tooling, packages, and architecture actually work.",
    actions: [
      {
        label: "Open Getting Started",
        path: "/getting-started",
        variant: "primary",
      },
      { label: "Read Core Concepts", path: "/core-concepts" },
    ],
    toc: [
      { id: "how-to-read", label: "How to read the docs" },
      { id: "system-map", label: "System map" },
      { id: "learning-paths", label: "Learning paths" },
    ],
    navOrder: 10,
    bodyHtml: join(
      section(
        "how-to-read",
        "Read With Intent",
        "Use the docs as the technical companion to the product website.",
        "KoppaJS is marketed as lean, component-first, modular, and explicit. These docs turn that promise into inspectable details: runtime behavior, component contracts, routing, tooling, and package boundaries.",
        join(
          cardGrid(
            3,
            card(
              "Start with structure",
              `Read ${docLink("/getting-started", "Getting Started")} if you are opening KoppaJS for the first time or standing up a fresh project.`,
              "Path 1",
            ),
            card(
              "Understand the model",
              `Read ${docLink("/core-concepts", "Core Concepts")} to understand how ${ic(".kpa")} components, reactivity, props, slots, and lifecycle work together.`,
              "Path 2",
            ),
            card(
              "Use reference last",
              `Use ${docLink("/api", "API")} and ${docLink("/routing", "Routing")} when you need exact contracts rather than orientation.`,
              "Path 3",
            ),
          ),
          callout(
            "Why this order matters",
            "KoppaJS stays small on purpose. If the top-level mental model is clear, the rest of the system is easier to inspect and maintain.",
            true,
          ),
        ),
      ),
      section(
        "system-map",
        "System Map",
        "The packages are small, but their boundaries are technical contracts.",
        "Each official package exists for one main responsibility. The docs explain those boundaries in enough detail that teams can adopt the stack deliberately.",
        join(
          table(
            ["Package", "Role", "Why it exists", "Owns"],
            packagesTableRows,
          ),
          codeBlock(
            "Minimal bootstrap",
            "ts",
            [
              'import { Core } from "@koppajs/koppajs-core";',
              "",
              'import appView from "./app-view.kpa";',
              'import counterComponent from "./counter-component.kpa";',
              "",
              'Core.take(appView, "app-view");',
              'Core.take(counterComponent, "counter-component");',
              "Core();",
            ].join("\n"),
          ),
        ),
      ),
      section(
        "learning-paths",
        "Learning Paths",
        "Choose the path that matches your immediate task.",
        "The docs structure is deliberately layered so product teams, framework evaluators, and maintainers can each move in a straight line.",
        cardGrid(
          3,
          card(
            "Start in 15 minutes",
            "Install the tooling, inspect the starter structure, and render a first component without introducing a router yet.",
            "Onboarding",
            docLink("/getting-started/installation", "Installation and setup"),
          ),
          card(
            "Understand architecture",
            "See how runtime, router, build pipeline, documentation, and contracts line up as separate but cooperating systems.",
            "Architecture",
            docLink("/architecture", "System architecture"),
          ),
          card(
            "Build a real app",
            "Move from isolated components to routing, examples, package boundaries, and migration decisions for a long-lived codebase.",
            "Delivery",
            docLink("/examples", "Examples and composition"),
          ),
        ),
      ),
    ),
  },
  {
    path: "/getting-started",
    name: "documentation-getting-started",
    label: "Getting Started",
    description:
      "Choose the right KoppaJS setup path, understand the first project shape, and move from install to a running browser surface quickly.",
    eyebrow: "Getting Started",
    headline: "From an empty directory to a readable application shell.",
    lead: "KoppaJS does not require a large bootstrap story. The minimal path is a Vite project, the official Vite plugin, explicit component registration, and a root custom element in the page.",
    actions: [
      {
        label: "Installation",
        path: "/getting-started/installation",
        variant: "primary",
      },
      { label: "Manual Setup", path: "/getting-started/manual-setup" },
    ],
    toc: [
      { id: "entry-paths", label: "Entry paths" },
      { id: "starter-shape", label: "Starter shape" },
      { id: "next-steps", label: "Next steps" },
    ],
    navOrder: 20,
    bodyHtml: join(
      section(
        "entry-paths",
        "Choose A Path",
        "There are two supported entry points.",
        "Use the scaffolder when you want a ready baseline. Use manual setup when you want to integrate KoppaJS into an existing Vite codebase and keep every file explicit.",
        cardGrid(
          2,
          card(
            "Scaffold a new app",
            "Use the official create-koppajs package when you want the current quality baseline, starter scripts, and a predictable structure immediately.",
            "Preferred",
            docLink("/getting-started/installation", "Open installation"),
          ),
          card(
            "Wire it manually",
            "Install core plus the Vite plugin yourself when you want to inspect every moving part and introduce KoppaJS into an existing repository deliberately.",
            "Explicit",
            docLink("/getting-started/manual-setup", "Open manual setup"),
          ),
        ),
      ),
      section(
        "starter-shape",
        "First Shape",
        "The initial project should stay small enough to inspect in one sitting.",
        "A production app can grow well beyond this, but the first baseline should make file responsibility obvious.",
        join(
          codeBlock(
            "Starter tree",
            "text",
            [
              "my-app/",
              "├── index.html",
              "├── package.json",
              "├── tsconfig.json",
              "├── vite.config.mjs",
              "├── public/",
              "│   └── favicon.svg",
              "└── src/",
              "    ├── main.ts",
              "    ├── style.css",
              "    ├── app-view.kpa",
              "    └── counter-component.kpa",
            ].join("\n"),
          ),
          list([
            `${ic("index.html")} owns the root custom element and the module entry.`,
            `${ic("src/main.ts")} registers components and calls ${ic("Core()")}.`,
            `${ic("app-view.kpa")} is a normal component, not a hidden framework file.`,
            `${ic("style.css")} is global by design. There is no hidden CSS scoping layer.`,
          ]),
        ),
      ),
      section(
        "next-steps",
        "Continue In Order",
        "Once the app runs, the next job is understanding why it runs that way.",
        "Stay close to the model instead of jumping straight into reference tables.",
        cardGrid(
          3,
          card(
            "Install",
            "Pin versions, install dependencies, and run the dev server.",
            "1",
            docLink("/getting-started/installation", "Open installation"),
          ),
          card(
            "Render",
            "Build a first component and inspect what the runtime expects.",
            "2",
            docLink("/getting-started/first-component", "Open first component"),
          ),
          card(
            "Understand",
            "Read the core concepts before adding routing or more packages.",
            "3",
            docLink("/core-concepts", "Open core concepts"),
          ),
        ),
      ),
    ),
  },
  {
    path: "/getting-started/installation",
    name: "documentation-getting-started-installation",
    label: "Installation",
    description:
      "Install KoppaJS with the supported runtime and build pipeline, then run the dev server from a clean baseline.",
    eyebrow: "Getting Started",
    headline: "Install the supported baseline without hidden setup.",
    lead: "The quickest stable path is the official scaffolder. It creates a small project with Vite, TypeScript, tests, and the current quality baseline already wired.",
    actions: [
      {
        label: "Project Structure",
        path: "/getting-started/project-structure",
        variant: "primary",
      },
      { label: "Manual Setup", path: "/getting-started/manual-setup" },
    ],
    toc: [
      { id: "requirements", label: "Requirements" },
      { id: "commands", label: "Install commands" },
      { id: "scripts", label: "Workflow scripts" },
    ],
    navOrder: 21,
    parentPath: "/getting-started",
    bodyHtml: join(
      section(
        "requirements",
        "Requirements",
        "Pin the environment before debugging symptoms.",
        "KoppaJS expects a current browser toolchain and a recent Node runtime. Getting the versions right first removes most bootstrap ambiguity.",
        join(
          table(
            ["Layer", "Requirement", "Reason"],
            [
              [
                "Node.js",
                ic(">=22"),
                "Current baseline across the maintained KoppaJS repositories.",
              ],
              [
                "TypeScript",
                ic(">=5.5 <6"),
                "Matches the supported Vite plugin transformation contract.",
              ],
              [
                "Vite",
                ic("^7.0.0"),
                "Reference build pipeline used by the official starters.",
              ],
            ],
          ),
          callout(
            "Why the docs stay explicit here",
            "Version drift is a common source of framework confusion. The supported baseline is part of the product contract, not trivia.",
            true,
          ),
        ),
      ),
      section(
        "commands",
        "Commands",
        "Use the scaffolder when you want the current supported baseline.",
        "The scaffolder creates a working application and keeps the generated files inspectable. It does not hide the runtime model after generation.",
        join(
          codeBlock(
            "Scaffold a new project",
            "bash",
            [
              "pnpm create koppajs my-app",
              "cd my-app",
              "pnpm install",
              "pnpm dev",
            ].join("\n"),
          ),
          codeBlock(
            "Alternative entry points",
            "bash",
            ["npm create koppajs my-app", "npx create-koppajs my-app"].join(
              "\n",
            ),
          ),
        ),
      ),
      section(
        "scripts",
        "Workflow Scripts",
        "The baseline scripts are deliberately ordinary.",
        "You should be able to infer what each command does from the package manifest without framework-specific wrappers.",
        table(
          ["Script", "Command", "Purpose"],
          [
            [ic("dev"), ic("vite"), "Start the development server."],
            [
              ic("build"),
              ic("npm run typecheck && vite build"),
              "Create the production bundle after type validation.",
            ],
            [
              ic("test"),
              ic("vitest run") + " or repository-specific browser checks",
              "Run repository-local verification.",
            ],
            [
              ic("preview"),
              ic("vite preview"),
              "Inspect the built bundle before deployment.",
            ],
          ],
        ),
      ),
    ),
  },
  {
    path: "/getting-started/project-structure",
    name: "documentation-getting-started-project-structure",
    label: "Project Structure",
    description:
      "Learn the minimal file structure of a KoppaJS app and how each file participates in the runtime and build pipeline.",
    eyebrow: "Getting Started",
    headline: "A KoppaJS project should stay readable from the filesystem.",
    lead: "The starter shape is intentionally small. The files you see are the files that matter: entry HTML, a TypeScript bootstrap, a couple of components, and a build config.",
    actions: [
      {
        label: "First Component",
        path: "/getting-started/first-component",
        variant: "primary",
      },
      { label: "Installation", path: "/getting-started/installation" },
    ],
    toc: [
      { id: "tree", label: "Repository tree" },
      { id: "roles", label: "File roles" },
      { id: "variants", label: "Starter variants" },
    ],
    navOrder: 22,
    parentPath: "/getting-started",
    bodyHtml: join(
      section(
        "tree",
        "Filesystem",
        "The baseline should be obvious at a glance.",
        "There is no generated labyrinth between the source files and the browser surface.",
        codeBlock(
          "Minimal starter layout",
          "text",
          [
            "src/",
            "├── main.ts",
            "├── style.css",
            "├── app-view.kpa",
            "└── counter-component.kpa",
            "",
            "index.html",
            "package.json",
            "tsconfig.json",
            "vite.config.mjs",
          ].join("\n"),
        ),
      ),
      section(
        "roles",
        "Roles",
        "Each file exists for a visible reason.",
        "If you cannot explain why a file exists, it probably does not belong in the baseline.",
        cardGrid(
          2,
          card(
            "index.html",
            "Hosts the root custom element and loads the application entry module.",
            "Entry",
          ),
          card(
            "main.ts",
            "Registers components and starts the runtime. Nothing else should secretly boot the app.",
            "Bootstrap",
          ),
          card(
            "app-view.kpa",
            "Defines the root UI shell using the same component contract as every other component.",
            "Root component",
          ),
          card(
            "vite.config.mjs",
            "Installs the official Vite plugin and keeps the build surface explicit.",
            "Build config",
          ),
        ),
      ),
      section(
        "variants",
        "Variants",
        "Add more structure only when the application boundary demands it.",
        "The router starter is appropriate once the application surface is route-based. Until then, a single custom-element tree is the simpler baseline.",
        join(
          list([
            "Use the minimal starter when one route or one shell is enough to prove the runtime model.",
            "Use the router starter when navigation and fallback behavior are already part of the first milestone.",
            "Avoid introducing package layers before the responsibility split is real in the codebase.",
          ]),
          callout(
            "Good first question",
            "Can a new teammate identify the entry point, root component, and build config in under a minute? If not, the structure is already hiding too much.",
            true,
          ),
        ),
      ),
    ),
  },
  {
    path: "/getting-started/first-component",
    name: "documentation-getting-started-first-component",
    label: "First Component",
    description:
      "Build a first KoppaJS component using the real runtime contract: template, controller, explicit registration, and root bootstrap.",
    eyebrow: "Getting Started",
    headline:
      "Your first component should explain the runtime, not conceal it.",
    lead: "A small counter example is enough to show the complete contract: a .kpa component file, a bootstrap file, and a root custom element in the HTML page.",
    actions: [
      {
        label: "Core Concepts",
        path: "/core-concepts/components",
        variant: "primary",
      },
      { label: "Manual Setup", path: "/getting-started/manual-setup" },
    ],
    toc: [
      { id: "component-file", label: "Component file" },
      { id: "bootstrap-file", label: "Bootstrap file" },
      { id: "inspect-flow", label: "Inspect the flow" },
    ],
    navOrder: 23,
    parentPath: "/getting-started",
    bodyHtml: join(
      section(
        "component-file",
        "Component File",
        "A .kpa file keeps template, controller, and styles together.",
        "The format is explicit enough that you can inspect one file and understand where the view, behavior, and CSS live.",
        codeBlock(
          "counter-component.kpa",
          "kpa",
          [
            "[template]",
            '  <div class="counter-card">',
            '    <span class="counter-label">Counter</span>',
            '    <p class="counter-value" role="status" aria-live="polite">{{ count }}</p>',
            '    <div class="counter-buttons">',
            '      <button type="button" onClick="decrement">−</button>',
            '      <button type="button" onClick="increment">+</button>',
            "    </div>",
            "  </div>",
            "[/template]",
            "",
            "[ts]",
            "  return {",
            "    state: { count: 0 },",
            "    methods: {",
            "      increment() {",
            "        this.count++;",
            "      },",
            "      decrement() {",
            "        this.count--;",
            "      },",
            "    },",
            "  };",
            "[/ts]",
          ].join("\n"),
        ),
      ),
      section(
        "bootstrap-file",
        "Bootstrap File",
        "Registration is a visible step, not hidden convention.",
        "KoppaJS keeps startup simple: import components, register them with names, then call the runtime.",
        codeBlock(
          "main.ts",
          "ts",
          [
            'import { Core } from "@koppajs/koppajs-core";',
            "",
            'import appView from "./app-view.kpa";',
            'import counterComponent from "./counter-component.kpa";',
            "",
            'Core.take(appView, "app-view");',
            'Core.take(counterComponent, "counter-component");',
            "Core();",
          ].join("\n"),
        ),
      ),
      section(
        "inspect-flow",
        "Inspect The Flow",
        "The browser behavior can be traced straight from the files.",
        "That direct traceability is part of the product philosophy, not an accidental side effect.",
        join(
          list(
            [
              `${ic("Core.take(..., name)")} registers the component under an explicit custom-element tag.`,
              `${ic("Core()")} boots once and mounts every registered element that already exists in the DOM.`,
              `${ic("onClick")} binds a controller method directly from the template instead of routing through a hidden event layer.`,
              `State mutation on ${ic("this.count")} triggers DOM updates through the runtime's reactive component model.`,
            ],
            true,
          ),
          callout(
            "Next move",
            `After this first component, read ${docLink("/core-concepts/components", "Components")} and ${docLink("/core-concepts/reactivity", "Reactivity")} while the bootstrap is still fresh in memory.`,
            true,
          ),
        ),
      ),
    ),
  },
  {
    path: "/getting-started/manual-setup",
    name: "documentation-getting-started-manual-setup",
    label: "Manual Setup",
    description:
      "Integrate KoppaJS into a Vite project manually by installing core, the Vite plugin, and a visible bootstrap file.",
    eyebrow: "Getting Started",
    headline: "Manual setup keeps every moving part visible.",
    lead: "If you want to understand the build boundary in detail or integrate KoppaJS into an existing Vite project, wire it manually. The setup surface is intentionally small.",
    actions: [
      { label: "Routing", path: "/routing", variant: "primary" },
      { label: "Tooling", path: "/tooling" },
    ],
    toc: [
      { id: "dependencies", label: "Dependencies" },
      { id: "vite", label: "Vite config" },
      { id: "entry-html", label: "Entry HTML and bootstrap" },
    ],
    navOrder: 24,
    parentPath: "/getting-started",
    bodyHtml: join(
      section(
        "dependencies",
        "Dependencies",
        "Install only the packages the runtime actually needs.",
        "The manual path is a good place to see the boundary between runtime and build time.",
        codeBlock(
          "Install commands",
          "bash",
          [
            "pnpm add @koppajs/koppajs-core",
            "pnpm add -D @koppajs/koppajs-vite-plugin vite typescript",
          ].join("\n"),
        ),
      ),
      section(
        "vite",
        "Vite Config",
        "The official Vite plugin owns .kpa transformation.",
        "The runtime does not parse component files. It consumes the transformed module contract emitted by the build layer.",
        codeBlock(
          "vite.config.mjs",
          "ts",
          [
            'import { defineConfig } from "vite";',
            'import koppaPlugin from "@koppajs/koppajs-vite-plugin";',
            "",
            "export default defineConfig({",
            "  plugins: [",
            "    koppaPlugin({",
            '      tsconfigFile: "./tsconfig.json",',
            "    }),",
            "  ],",
            "});",
          ].join("\n"),
        ),
      ),
      section(
        "entry-html",
        "HTML And Bootstrap",
        "The page still mounts a normal custom element.",
        "There is no hidden application container or compile-time root abstraction.",
        join(
          cardGrid(
            2,
            codeBlock(
              "index.html",
              "html",
              [
                "<!doctype html>",
                '<html lang="en">',
                "  <head>",
                '    <meta charset="UTF-8" />',
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
                "    <title>My KoppaJS App</title>",
                "  </head>",
                "  <body>",
                "    <app-view></app-view>",
                '    <script type="module" src="/src/main.ts"></script>',
                "  </body>",
                "</html>",
              ].join("\n"),
            ),
            codeBlock(
              "main.ts",
              "ts",
              [
                'import { Core } from "@koppajs/koppajs-core";',
                "",
                'import appView from "./app-view.kpa";',
                "",
                'Core.take(appView, "app-view");',
                "Core();",
              ].join("\n"),
            ),
          ),
          callout(
            "When to stop adding setup",
            "If the app runs, renders one component, and you can explain every imported package, the setup layer is complete enough. Move on to concepts instead of accumulating infrastructure.",
            true,
          ),
        ),
      ),
    ),
  },
  {
    path: "/core-concepts",
    name: "documentation-core-concepts",
    label: "Core Concepts",
    description:
      "Learn the working model behind KoppaJS components, templates, state updates, props, slots, events, and lifecycle hooks.",
    eyebrow: "Core Concepts",
    headline: "KoppaJS stays understandable when each concept keeps one job.",
    lead: "The runtime model is small enough to hold in your head. Components render UI, state mutations trigger updates, templates declare bindings, and hooks let you coordinate side effects without hiding the order of execution.",
    actions: [
      {
        label: "Components",
        path: "/core-concepts/components",
        variant: "primary",
      },
      { label: "Lifecycle", path: "/core-concepts/lifecycle" },
    ],
    toc: [
      { id: "concept-map", label: "Concept map" },
      { id: "working-model", label: "Working model" },
      { id: "where-next", label: "Where next" },
    ],
    navOrder: 30,
    bodyHtml: join(
      section(
        "concept-map",
        "Map",
        "These topics form the runtime mental model.",
        "You do not need hidden abstractions once the component contract, template syntax, and lifecycle rules are clear.",
        cardGrid(
          4,
          card(
            "Components",
            "Single-file components, explicit registration, and custom-element boundaries.",
            "Topic",
            docLink("/core-concepts/components", "Open components"),
          ),
          card(
            "Templates",
            "Interpolation, directives, loops, refs, and event binding.",
            "Topic",
            docLink("/core-concepts/templates", "Open templates"),
          ),
          card(
            "Reactivity",
            "State mutation, update filtering, and changed path semantics.",
            "Topic",
            docLink("/core-concepts/reactivity", "Open reactivity"),
          ),
          card(
            "Lifecycle",
            "Hook order and where imperative work belongs.",
            "Topic",
            docLink("/core-concepts/lifecycle", "Open lifecycle"),
          ),
        ),
      ),
      section(
        "working-model",
        "Model",
        "A KoppaJS app has a traceable execution path.",
        "That path stays stable even as the app grows into multiple routes or modules.",
        join(
          list(
            [
              `${ic("main.ts")} imports component modules and registers them through ${ic("Core.take(...)")}.`,
              `${ic("Core()")} boots the runtime once and mounts registered custom elements already present in the DOM.`,
              "Template bindings map visible state and methods to visible markup.",
              "Lifecycle hooks let you run side effects before mount, after processing, during updates, and before destroy.",
            ],
            true,
          ),
          codeBlock(
            "Working model",
            "ts",
            [
              'import { Core } from "@koppajs/koppajs-core";',
              "",
              'import appView from "./app-view.kpa";',
              'import storePlugin from "./store-plugin";',
              "",
              "Core.take(storePlugin);",
              'Core.take(appView, "app-view");',
              "Core();",
            ].join("\n"),
          ),
        ),
      ),
      section(
        "where-next",
        "Continue",
        "Read the subtopics in build order.",
        "The most useful progression is component structure first, then template behavior, then reactivity and lifecycle.",
        cardGrid(
          3,
          card(
            "Structure",
            "Read how .kpa files are shaped and registered.",
            "1",
            docLink("/core-concepts/components", "Open components"),
          ),
          card(
            "Render",
            "Read how template expressions, loops, refs, and event bindings work.",
            "2",
            docLink("/core-concepts/templates", "Open templates"),
          ),
          card(
            "Update",
            "Read how state changes and hooks interact during runtime updates.",
            "3",
            docLink("/core-concepts/reactivity", "Open reactivity"),
          ),
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/components",
    name: "documentation-core-concepts-components",
    label: "Components",
    description:
      "Understand the .kpa component file format, explicit registration, and why Components are the central building block of KoppaJS applications.",
    eyebrow: "Core Concepts",
    headline: "Components are the central building block, not an afterthought.",
    lead: "A .kpa component keeps structure, behavior, and styles inside one inspectable boundary. KoppaJS starts from that component model instead of layering it on top of unrelated runtime conventions.",
    actions: [
      {
        label: "Templates",
        path: "/core-concepts/templates",
        variant: "primary",
      },
      { label: "Props", path: "/core-concepts/props" },
    ],
    toc: [
      { id: "file-anatomy", label: "File anatomy" },
      { id: "registration", label: "Registration" },
      { id: "boundaries", label: "Component boundaries" },
    ],
    navOrder: 31,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "file-anatomy",
        "Anatomy",
        "A .kpa file declares structure, logic, and style in one place.",
        "The sections are explicit enough that the build layer can transform them deterministically while the runtime receives a clear component contract.",
        join(
          table(
            ["Block", "Syntax", "Responsibility"],
            [
              [
                "Template",
                `${ic("[template] ... [/template]")}`,
                "HTML structure, interpolation, directives, and event bindings.",
              ],
              [
                "Script",
                `${ic("[ts] ... [/ts]")} or ${ic("[js] ... [/js]")}`,
                "State, methods, props, lifecycle hooks, and event tuple declarations.",
              ],
              [
                "Style",
                `${ic("[css]")} / ${ic("[scss]")} / ${ic("[sass]")}`,
                "Component-related CSS emitted into the final application bundle.",
              ],
            ],
          ),
          codeBlock(
            "Component anatomy",
            "kpa",
            [
              "[template]",
              '  <section class="status-card">',
              "    <h2>{{ title }}</h2>",
              "    <p>{{ message }}</p>",
              "  </section>",
              "[/template]",
              "",
              "[ts]",
              "  return {",
              "    props: {",
              "      title: { type: String, required: true },",
              '      message: { type: String, default: "Ready." },',
              "    },",
              "  };",
              "[/ts]",
            ].join("\n"),
          ),
        ),
      ),
      section(
        "registration",
        "Registration",
        "Components do not auto-register from the filesystem.",
        "The bootstrap file decides which components are part of the application surface.",
        codeBlock(
          "Explicit registration",
          "ts",
          [
            'import { Core } from "@koppajs/koppajs-core";',
            "",
            'import appView from "./app-view.kpa";',
            'import statusCard from "./status-card.kpa";',
            "",
            'Core.take(appView, "app-view");',
            'Core.take(statusCard, "status-card");',
            "Core();",
          ].join("\n"),
        ),
      ),
      section(
        "boundaries",
        "Boundaries",
        "Keep component responsibilities small and visible.",
        "A component should either render UI, coordinate stateful behavior for a clear slice of the interface, or expose a reusable shell. It should not hide application wiring that belongs in the bootstrap, router, or build layer.",
        list([
          "Use props for inputs and custom events for parent communication.",
          "Keep service registration in plugins or modules, not inside presentational components.",
          "Prefix CSS selectors with the component tag or a local root class because styles are global by design.",
          "Move route ownership, application bootstrapping, and package wiring outside the component file.",
        ]),
      ),
    ),
  },
  {
    path: "/core-concepts/templates",
    name: "documentation-core-concepts-templates",
    label: "Templates",
    description:
      "Learn the KoppaJS template surface: interpolation, conditional branches, loops, refs, and direct event bindings.",
    eyebrow: "Core Concepts",
    headline: "Templates declare behavior close to the markup.",
    lead: "KoppaJS templates are intentionally small. The goal is to read the DOM shape and the dynamic behavior from the same place without introducing a second hidden language.",
    actions: [
      {
        label: "Reactivity",
        path: "/core-concepts/reactivity",
        variant: "primary",
      },
      { label: "Events", path: "/core-concepts/events" },
    ],
    toc: [
      { id: "directive-table", label: "Directive table" },
      { id: "examples", label: "Examples" },
      { id: "refs", label: "Refs and DOM access" },
    ],
    navOrder: 32,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "directive-table",
        "Directives",
        "The template surface is compact enough to keep in active memory.",
        "That compactness is one of the main reasons KoppaJS stays readable in long-lived applications.",
        table(
          ["Concept", "Syntax", "Purpose"],
          [
            [
              "Interpolation",
              escapeHtml("{{ expression }}"),
              "Render text output from state or props.",
            ],
            [
              "Dynamic attribute",
              escapeHtml(':attr="expression"'),
              "Bind attributes directly from expressions.",
            ],
            [
              "Condition",
              escapeHtml('if="condition"'),
              "Render a branch only when the condition is truthy.",
            ],
            [
              "Else if",
              escapeHtml('else-if="condition"'),
              "Continue a conditional chain.",
            ],
            ["Else", escapeHtml("else"), "Fallback branch."],
            [
              "Loop",
              escapeHtml('loop="item in items"'),
              "Iterate over arrays or iterable collections.",
            ],
            [
              "Tuple loop",
              escapeHtml('loop="[key, value] in entries"'),
              "Iterate while exposing both key and value.",
            ],
            [
              "Ref",
              escapeHtml('ref="name"'),
              "Store an element reference on " + "$refs" + ".",
            ],
            [
              "Event",
              escapeHtml('onClick="method"'),
              "Bind a component method directly from markup.",
            ],
          ],
        ),
      ),
      section(
        "examples",
        "Examples",
        "Most template behavior fits into small, local examples.",
        "You should be able to predict how the runtime will treat each block from the markup alone.",
        cardGrid(
          2,
          codeBlock(
            "Conditional rendering",
            "kpa",
            [
              '<p if="status === \\"active\\"">Active</p>',
              '<p else-if="status === \\"pending\\"">Pending</p>',
              "<p else>Archived</p>",
            ].join("\n"),
          ),
          codeBlock(
            "Loops",
            "kpa",
            [
              '<li loop="item in items">{{ item }}</li>',
              "",
              '<div loop="[key, value] in settings">',
              "  {{ key }} = {{ value }}",
              "</div>",
            ].join("\n"),
          ),
        ),
      ),
      section(
        "refs",
        "Refs",
        "Refs are the escape hatch for imperative DOM work.",
        "Use them when you need to focus an input, measure a box, or interact with a browser API after render. Do not use them to bypass the normal state-driven rendering model.",
        codeBlock(
          "Ref usage",
          "kpa",
          [
            "[template]",
            '  <input ref="searchInput" type="search" />',
            '  <button type="button" onClick="focusSearch">Focus</button>',
            "[/template]",
            "",
            "[ts]",
            "  return {",
            "    methods: {",
            "      focusSearch() {",
            "        $refs.searchInput?.focus();",
            "      },",
            "    },",
            "  };",
            "[/ts]",
          ].join("\n"),
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/reactivity",
    name: "documentation-core-concepts-reactivity",
    label: "Reactivity",
    description:
      "See how KoppaJS state updates trigger rendering, how update paths are tracked, and when watchList should be used deliberately.",
    eyebrow: "Core Concepts",
    headline: "State changes are visible, direct, and intentionally ordinary.",
    lead: "KoppaJS uses a reactive component model, but it does not ask you to learn a second state language. Mutate component state directly and let the runtime coordinate DOM updates.",
    actions: [
      {
        label: "Lifecycle",
        path: "/core-concepts/lifecycle",
        variant: "primary",
      },
      { label: "API", path: "/api" },
    ],
    toc: [
      { id: "state-model", label: "State model" },
      { id: "watch-list", label: "watchList" },
      { id: "changed-paths", label: "changedPaths" },
    ],
    navOrder: 33,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "state-model",
        "State",
        "Reactive state lives in the returned component object.",
        "Mutating state is enough to trigger a rerender. You do not need a reducer layer or a separate setter API for ordinary component state changes.",
        codeBlock(
          "Reactive state",
          "ts",
          [
            "return {",
            "  state: {",
            "    count: 0,",
            '    status: "idle",',
            "  },",
            "  methods: {",
            "    increment() {",
            "      this.count++;",
            '      this.status = "updated";',
            "    },",
            "  },",
            "};",
          ].join("\n"),
        ),
      ),
      section(
        "watch-list",
        "watchList",
        "Use update filtering only when you have a specific reason.",
        "The default should be clarity, not premature optimization. Introduce watchList when a component is large enough that unfiltered updates become a real maintenance or performance concern.",
        join(
          codeBlock(
            "Filtered updates",
            "ts",
            [
              "return {",
              '  watchList: ["filters", "selectedId"],',
              "  state: {",
              "    filters: { status: 'open' },",
              "    selectedId: null,",
              "    auditTrail: [],",
              "  },",
              "};",
            ].join("\n"),
          ),
          callout(
            "Rule of thumb",
            "If you cannot explain why a path belongs in watchList, remove the filter and keep the update behavior obvious.",
            true,
          ),
        ),
      ),
      section(
        "changed-paths",
        "changedPaths",
        "Update hooks expose which state paths changed.",
        "Use this when an imperative side effect depends on specific changes rather than every update.",
        table(
          ["Hook", "What you can inspect", "Good use"],
          [
            [
              ic("beforeUpdate"),
              ic("this.changedPaths"),
              "Prepare side effects before the DOM patch lands.",
            ],
            [
              ic("updated"),
              ic("this.changedPaths"),
              "Focus, measurement, or browser APIs after the new DOM is ready.",
            ],
          ],
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/events",
    name: "documentation-core-concepts-events",
    label: "Events",
    description:
      "Handle DOM events, custom events, and event tuples explicitly in KoppaJS components without hidden controller layers.",
    eyebrow: "Core Concepts",
    headline:
      "Events stay close to the element or the explicit target definition.",
    lead: "KoppaJS supports direct template-bound methods and an event tuple surface for attaching listeners to elements, refs, or browser-level targets.",
    actions: [
      { label: "Props", path: "/core-concepts/props", variant: "primary" },
      { label: "Slots", path: "/core-concepts/slots" },
    ],
    toc: [
      { id: "template-events", label: "Template events" },
      { id: "event-tuples", label: "Event tuples" },
      { id: "custom-events", label: "Custom events" },
    ],
    navOrder: 34,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "template-events",
        "Template Events",
        "Bind methods directly where the interaction happens.",
        "This keeps the event source visible in the template and the implementation visible in the controller.",
        codeBlock(
          "Direct event binding",
          "kpa",
          [
            "[template]",
            '  <button type="button" onClick="save">Save</button>',
            "[/template]",
            "",
            "[ts]",
            "  return {",
            "    methods: {",
            "      save() {",
            "        this.isSaving = true;",
            "      },",
            "    },",
            "  };",
            "[/ts]",
          ].join("\n"),
        ),
      ),
      section(
        "event-tuples",
        "Event Tuples",
        "Attach listeners to non-template targets when needed.",
        "The tuple contract is explicit enough that you can see the target and the handler without reading framework internals.",
        join(
          codeBlock(
            "Window-level listener",
            "ts",
            [
              "return {",
              "  events: [",
              '    ["keydown", "window", function handleEscape(event) {',
              '      if (event.key === "Escape") {',
              "        this.isOpen = false;",
              "      }",
              "    }],",
              "  ],",
              "};",
            ].join("\n"),
          ),
          table(
            ["Target form", "Meaning"],
            [
              [ic('"window"'), "Bind directly to the global window object."],
              [
                ic('".selector"'),
                "Use a CSS selector inside the component boundary.",
              ],
              [ic('{ ref: "panel" }'), "Use a named ref as the event target."],
              [
                ic('{ ref: "list", selector: ".item" }'),
                "Select descendants under a ref root.",
              ],
            ],
          ),
        ),
      ),
      section(
        "custom-events",
        "Custom Events",
        "Send component-level signals upward when a parent needs to react.",
        "Custom events are useful when a child component should remain reusable and not reach into parent state directly.",
        codeBlock(
          "Emit upward",
          "ts",
          [
            "return {",
            "  methods: {",
            "    submitSelection() {",
            '      $emit("confirm", { id: this.selectedId });',
            "    },",
            "  },",
            "};",
          ].join("\n"),
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/props",
    name: "documentation-core-concepts-props",
    label: "Props",
    description:
      "Define explicit component inputs with type checks, defaults, and required markers using the KoppaJS props contract.",
    eyebrow: "Core Concepts",
    headline: "Props make component inputs inspectable at the file boundary.",
    lead: "Use props for data that flows into a component from the outside. Keep defaults, required markers, and validation visible in the returned component object.",
    actions: [
      { label: "Slots", path: "/core-concepts/slots", variant: "primary" },
      { label: "Lifecycle", path: "/core-concepts/lifecycle" },
    ],
    toc: [
      { id: "definitions", label: "Definitions" },
      { id: "rules", label: "Rules" },
      { id: "two-way", label: "Binding notes" },
    ],
    navOrder: 35,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "definitions",
        "Definitions",
        "Declare inputs with the same explicitness as state and methods.",
        "A prop definition should tell a future maintainer what the component expects before they read the implementation body.",
        codeBlock(
          "Prop definitions",
          "ts",
          [
            "return {",
            "  props: {",
            "    title: { type: String, required: true },",
            '    status: { type: String, default: "idle" },',
            "    count: { type: Number, default: 0 },",
            "    showActions: { type: Boolean, default: false },",
            "  },",
            "};",
          ].join("\n"),
        ),
      ),
      section(
        "rules",
        "Rules",
        "Use prop validation to document the component boundary clearly.",
        "Keep prop contracts narrow and honest. If a component needs many inputs with deep coupling, consider splitting it into smaller parts.",
        table(
          ["Field", "Purpose"],
          [
            [
              ic("type"),
              "Expected JavaScript constructor such as String, Number, Boolean, Array, Object, or Function.",
            ],
            [
              ic("required"),
              "Marks the prop as mandatory at the component boundary.",
            ],
            [
              ic("default"),
              "Provides a fallback value when the consumer omits the prop.",
            ],
            [
              ic("regex"),
              "Adds lightweight validation for string props when needed.",
            ],
          ],
        ),
      ),
      section(
        "two-way",
        "Binding Notes",
        "Use two-way binding sparingly and only when the ownership is obvious.",
        "If a child component needs broad authority over parent state, the boundary is probably too loose. Favor clear input and explicit custom events before reaching for more coupled patterns.",
        callout(
          "Practical guidance",
          "Props should describe what the component needs to render or behave correctly. They should not become a side channel for application-level service wiring.",
          true,
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/slots",
    name: "documentation-core-concepts-slots",
    label: "Slots",
    description:
      "Use default and named slots to compose layout shells without hiding where content originates.",
    eyebrow: "Core Concepts",
    headline: "Slots keep composition explicit when structure is reusable.",
    lead: "Slots are useful when a component owns structure but not every piece of content. They are especially helpful for shells, cards, frames, and route layouts.",
    actions: [
      {
        label: "Lifecycle",
        path: "/core-concepts/lifecycle",
        variant: "primary",
      },
      { label: "Examples", path: "/examples" },
    ],
    toc: [
      { id: "named-slots", label: "Named slots" },
      { id: "when-to-use", label: "When to use slots" },
      { id: "slot-discipline", label: "Slot discipline" },
    ],
    navOrder: 36,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "named-slots",
        "Named Slots",
        "Use slots when structure is stable but content varies.",
        "A component can own layout while callers still provide the content for well-defined regions.",
        codeBlock(
          "Layout shell with slots",
          "kpa",
          [
            "[template]",
            '  <section class="page-frame">',
            '    <header><slot name="header"></slot></header>',
            "    <main><slot></slot></main>",
            '    <footer><slot name="footer"></slot></footer>',
            "  </section>",
            "[/template]",
            "",
            "<page-frame>",
            '  <h1 slot="header">Project status</h1>',
            "  <p>Everything visible here is consumer-provided content.</p>",
            '  <small slot="footer">Updated every release.</small>',
            "</page-frame>",
          ].join("\n"),
        ),
      ),
      section(
        "when-to-use",
        "Use Cases",
        "Slots are best for composition, not for hiding application logic.",
        "If the component needs to decide how content is generated, props and state are usually the clearer contract. If it only needs to place consumer-owned content into known regions, slots are a good fit.",
        list([
          "Page frames and documentation shells.",
          "Cards with optional header or footer regions.",
          "Toolbars or action bars where the shell owns spacing and semantics but not every button.",
        ]),
      ),
      section(
        "slot-discipline",
        "Slot Discipline",
        "Keep the ownership boundary narrow and stable.",
        "Slots work best when callers know exactly which regions exist and who is responsible for the content inside them.",
        table(
          ["Rule", "Why it matters"],
          [
            [
              "The consumer owns slot content and its state context.",
              "The shell stays presentational instead of becoming a hidden controller for caller-owned content.",
            ],
            [
              "The shell owns layout, semantics, and region placement.",
              "Composition stays reusable because the structure remains stable across callers.",
            ],
            [
              "Named slots should stay few and intentionally public.",
              "Too many slot names turn a simple layout shell into an undocumented layout DSL.",
            ],
            [
              "Fallback content should be safe and literal.",
              "Defaults can clarify empty states, but they should not hide application branching or business decisions.",
            ],
          ],
        ),
      ),
    ),
  },
  {
    path: "/core-concepts/lifecycle",
    name: "documentation-core-concepts-lifecycle",
    label: "Lifecycle",
    description:
      "Understand the order and purpose of KoppaJS lifecycle hooks so side effects stay predictable and cleanup stays explicit.",
    eyebrow: "Core Concepts",
    headline: "Lifecycle hooks are useful because their order is predictable.",
    lead: "KoppaJS exposes hook timing directly. That makes it easier to decide where to fetch data, measure the DOM, attach browser listeners, or clean up before removal.",
    actions: [
      { label: "API Reference", path: "/api", variant: "primary" },
      { label: "Routing", path: "/routing" },
    ],
    toc: [
      { id: "hook-order", label: "Hook order" },
      { id: "hook-usage", label: "Hook usage" },
    ],
    navOrder: 37,
    parentPath: "/core-concepts",
    bodyHtml: join(
      section(
        "hook-order",
        "Order",
        "The runtime hook sequence is stable and should stay unsurprising.",
        "That predictability is part of what makes the framework maintainable in long-lived projects.",
        join(
          table(
            ["Hook", "When", "Typical use"],
            [
              [
                ic("created"),
                "After script evaluation, before first mount.",
                "Prepare local state or read services.",
              ],
              [
                ic("beforeMount"),
                "Immediately before the first DOM insertion.",
                "Final adjustments before initial render.",
              ],
              [
                ic("mounted"),
                "After the first DOM insertion.",
                "Focus management, measurement, or browser APIs.",
              ],
              [
                ic("processed"),
                "After template processing on each render.",
                "Observe post-processing behavior when needed.",
              ],
              [
                ic("beforeUpdate"),
                "Before rerendering during an update.",
                "Compare state or prepare imperative work.",
              ],
              [
                ic("updated"),
                "After rerendering during an update.",
                "React to the finished DOM state.",
              ],
              [
                ic("beforeDestroy"),
                "Before the component is removed.",
                "Tear down timers and listeners.",
              ],
              [
                ic("destroyed"),
                "After removal.",
                "Final teardown notification point.",
              ],
            ],
          ),
          codeBlock(
            "Lifecycle sequence",
            "text",
            [
              "created -> beforeMount -> [processed] -> mounted",
              "             ↓",
              "     beforeUpdate -> [processed] -> updated",
              "             ↓",
              "     beforeDestroy -> destroyed",
            ].join("\n"),
          ),
        ),
      ),
      section(
        "hook-usage",
        "Usage",
        "Choose the hook that matches the side effect, not the one that merely works.",
        "Lifecycle confusion usually appears when imperative work is placed too early or cleanup is forgotten.",
        cardGrid(
          3,
          card(
            "Read services in created",
            "Use created when you need stores, plugins, or derived state before the first mount.",
            "Do",
          ),
          card(
            "Measure in mounted or updated",
            "DOM size, focus, and browser-only APIs belong after the element exists.",
            "Do",
          ),
          card(
            "Clean up in beforeDestroy",
            "Listeners, observers, and timers should leave when the component leaves.",
            "Do",
          ),
        ),
      ),
    ),
  },
  {
    path: "/routing",
    name: "documentation-routing",
    label: "Routing",
    description:
      "Integrate @koppajs/koppajs-router with explicit route definitions, metadata, and application-owned component tags.",
    eyebrow: "Routing",
    headline: "Routing is a separate package with a narrow contract.",
    lead: "The router owns path normalization, matching, redirects, browser history, active-link state, and outlet rendering. The application still owns route metadata and component registration.",
    actions: [
      { label: "Tooling", path: "/tooling", variant: "primary" },
      { label: "Architecture", path: "/architecture" },
    ],
    toc: [
      { id: "route-definitions", label: "Route definitions" },
      { id: "router-bootstrap", label: "Router bootstrap" },
      { id: "behavior", label: "Runtime behavior" },
    ],
    navOrder: 40,
    bodyHtml: join(
      section(
        "route-definitions",
        "Routes",
        "Every final route should be explicit about metadata and rendering.",
        "The router expects the application to define title, description, and componentTag for renderable routes. That keeps ownership clear and avoids hidden content conventions.",
        codeBlock(
          "Route definitions",
          "ts",
          [
            'import { type RouteDefinition } from "@koppajs/koppajs-router";',
            "",
            "export const routes = [",
            "  {",
            '    path: "/",',
            '    name: "home",',
            '    title: "Home",',
            '    description: "Landing page",',
            '    componentTag: "home-page",',
            "  },",
            "  {",
            '    path: "/docs",',
            '    name: "docs",',
            '    redirectTo: { name: "documentation-overview" },',
            "  },",
            "  {",
            '    path: "*",',
            '    name: "not-found",',
            '    title: "Not found",',
            '    description: "Missing page",',
            '    componentTag: "not-found-page",',
            "  },",
            "] satisfies readonly RouteDefinition[];",
          ].join("\n"),
        ),
      ),
      section(
        "router-bootstrap",
        "Bootstrap",
        "The router needs an outlet, a route table, and a root.",
        "All application-owned page components must still be registered with KoppaJS before the router tries to render them.",
        codeBlock(
          "Router initialization",
          "ts",
          [
            'import { KoppajsRouter } from "@koppajs/koppajs-router";',
            "",
            'const outlet = document.querySelector<HTMLElement>("#app-outlet");',
            "",
            "if (!outlet) {",
            '  throw new Error("App outlet not found.");',
            "}",
            "",
            "const router = new KoppajsRouter({",
            "  routes,",
            "  outlet,",
            "  root: document,",
            "  basePath: import.meta.env.BASE_URL,",
            '  scrollBehavior: "auto",',
            "});",
            "",
            "router.init();",
          ].join("\n"),
        ),
      ),
      section(
        "behavior",
        "Behavior",
        "The router owns navigation mechanics, not page semantics.",
        "This split is important when you embed the documentation app inside the website: the docs package provides docs routes and metadata, while the website decides where those routes sit in its own shell.",
        table(
          ["Concern", "Owned by router", "Owned by app"],
          [
            ["Path matching", "Yes", "No"],
            ["History API updates", "Yes", "No"],
            [
              "Page titles and descriptions",
              "Only applies what the route record declares",
              "Defines the values",
            ],
            ["Custom element registration", "No", "Yes"],
            ["Content and copy", "No", "Yes"],
          ],
        ),
      ),
    ),
  },
  {
    path: "/tooling",
    name: "documentation-tooling",
    label: "Tooling",
    description:
      "Configure the Vite plugin, TypeScript, and repository quality workflow around KoppaJS while keeping build-time behavior explicit.",
    eyebrow: "Tooling",
    headline: "Build-time work should not masquerade as runtime magic.",
    lead: "The official tooling story is intentionally small: Vite, the KoppaJS Vite plugin, TypeScript, and ordinary repository checks around linting, tests, and production builds.",
    actions: [
      { label: "Examples", path: "/examples", variant: "primary" },
      { label: "API", path: "/api" },
    ],
    toc: [
      { id: "vite-plugin", label: "Vite plugin" },
      { id: "type-checking", label: "Type checking" },
      { id: "repository-baseline", label: "Repository baseline" },
      { id: "quality-gates", label: "Quality gates" },
    ],
    navOrder: 50,
    bodyHtml: join(
      section(
        "vite-plugin",
        "Vite Plugin",
        "The plugin transforms .kpa files into the runtime contract.",
        "It does not perform runtime work. That split is central to KoppaJS: what can be resolved during the build should be visible in the build pipeline instead of hidden inside browser execution.",
        codeBlock(
          "vite.config.mjs",
          "ts",
          [
            'import { defineConfig } from "vite";',
            'import koppaPlugin from "@koppajs/koppajs-vite-plugin";',
            "",
            "export default defineConfig({",
            "  plugins: [",
            "    koppaPlugin({",
            '      tsconfigFile: "./tsconfig.json",',
            "    }),",
            "  ],",
            "});",
          ].join("\n"),
        ),
      ),
      section(
        "type-checking",
        "Typing",
        "TypeScript belongs in the normal repository workflow.",
        "Use a regular tsconfig and a regular typecheck script. There is no separate framework-specific compiler command that should replace basic repository hygiene.",
        table(
          ["Check", "Suggested command", "Purpose"],
          [
            [
              "Type check",
              ic("tsc --noEmit"),
              "Validate TypeScript and component import types.",
            ],
            ["Build", ic("vite build"), "Create the production bundle."],
            [
              "Unit tests",
              ic("vitest run"),
              "Protect route and runtime contracts in isolation.",
            ],
            [
              "Browser tests",
              ic("playwright test"),
              "Verify navigation and rendered behavior in a real browser.",
            ],
          ],
        ),
      ),
      section(
        "repository-baseline",
        "Repository Baseline",
        "KoppaJS should fit into an ordinary frontend repository contract.",
        "The build layer is easier to trust when the package manifest and repository scripts describe the workflow directly.",
        codeBlock(
          "package.json scripts",
          "json",
          [
            "{",
            '  "scripts": {',
            '    "dev": "vite",',
            '    "typecheck": "tsc --noEmit",',
            '    "build": "npm run typecheck && vite build",',
            '    "test": "vitest run",',
            '    "preview": "vite preview"',
            "  }",
            "}",
          ].join("\n"),
        ),
      ),
      section(
        "quality-gates",
        "Quality Gates",
        "Production readiness is a repository behavior, not just a UI outcome.",
        "The KoppaJS ecosystem treats versioning, CI, and deterministic builds as part of the trust surface around the product.",
        callout(
          "Suggested baseline",
          "Run formatting checks, linting, typechecking, unit tests, and a production build in CI. Use browser tests where navigation or deep-link behavior matters.",
        ),
      ),
    ),
  },
  {
    path: "/examples",
    name: "documentation-examples",
    label: "Examples",
    description:
      "Study practical KoppaJS examples ranging from small patterns to a route-based application shell and todo-style composition.",
    eyebrow: "Examples",
    headline: "Examples should show composition, not just syntax fragments.",
    lead: "Small snippets are useful, but you also need examples that show how components, routes, and repository structure fit together once the app stops being a toy.",
    actions: [
      { label: "Packages", path: "/packages", variant: "primary" },
      { label: "Migration", path: "/migration" },
    ],
    toc: [
      { id: "small-patterns", label: "Small patterns" },
      { id: "app-shape", label: "Application shape" },
      { id: "reference-scenarios", label: "Reference scenarios" },
      { id: "what-to-copy", label: "What to copy" },
    ],
    navOrder: 60,
    bodyHtml: join(
      section(
        "small-patterns",
        "Patterns",
        "Start with a focused pattern before scaling the app shape.",
        "You should be able to isolate a UI concern, prove the runtime behavior, and then combine those small pieces in a route shell.",
        cardGrid(
          3,
          card(
            "Counter",
            "A first example for state mutation and direct template-bound events.",
            "Example",
          ),
          card(
            "Conditional panel",
            "Shows conditional rendering and explicit branch ownership.",
            "Example",
          ),
          card(
            "Todo list",
            "Demonstrates loops, local state, child composition, and event flow.",
            "Example",
          ),
        ),
      ),
      section(
        "app-shape",
        "Application Shape",
        "A real app usually needs more than a single root component.",
        "The point is not to create framework ceremony. The point is to make the growth path from a component demo to a maintainable route shell explicit.",
        codeBlock(
          "Route-based app structure",
          "text",
          [
            "src/",
            "├── main.ts",
            "├── app-routes.ts",
            "├── components/",
            "│   ├── app-shell.kpa",
            "│   ├── todo-list.kpa",
            "│   └── todo-form.kpa",
            "└── pages/",
            "    ├── home-page.kpa",
            "    ├── tasks-page.kpa",
            "    └── not-found-page.kpa",
          ].join("\n"),
        ),
      ),
      section(
        "reference-scenarios",
        "Reference Scenarios",
        "The right example depends on what boundary you are trying to prove.",
        "Examples are most useful when they match the level of architecture you need to make a decision about.",
        table(
          ["Scenario", "What to prove", "Typical packages"],
          [
            [
              "Single-surface component app",
              "Component registration, local state, events, and explicit bootstrap.",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-vite-plugin")}`,
            ],
            [
              "Route-based application shell",
              "Route ownership, fallback behavior, metadata, and outlet rendering.",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-router")} + ${ic("@koppajs/koppajs-vite-plugin")}`,
            ],
            [
              "Public product with integrated docs",
              "Website/docs boundaries, shared navigation, and embeddable documentation rendering.",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-router")} + ${ic("@koppajs/koppajs-vite-plugin")} + ${ic("koppajs-documentation")}`,
            ],
          ],
        ),
      ),
      section(
        "what-to-copy",
        "What To Copy",
        "Copy patterns, not entire applications.",
        "The right lesson from an example is usually the boundary: where a route table lives, how a component communicates, or how a package is introduced. Avoid inheriting structure that your app does not need yet.",
        list([
          "Copy the explicit bootstrap shape.",
          "Copy component communication patterns that fit your ownership boundaries.",
          "Copy route metadata discipline once navigation becomes part of the app surface.",
        ]),
      ),
    ),
  },
  {
    path: "/api",
    name: "documentation-api",
    label: "API",
    description:
      "Reference the stable public surfaces across the KoppaJS runtime model: bootstrap API, component return object, directives, and lifecycle hooks.",
    eyebrow: "API",
    headline: "Use the API page when you need exact contract language.",
    lead: "This reference keeps the most important runtime contracts in one place: bootstrapping, component return fields, template directives, and lifecycle semantics.",
    actions: [
      { label: "Packages", path: "/packages", variant: "primary" },
      { label: "Architecture", path: "/architecture" },
    ],
    toc: [
      { id: "core-api", label: "Core API" },
      { id: "component-contract", label: "Component contract" },
      { id: "template-api", label: "Template API" },
      { id: "limitations", label: "Known limitations" },
    ],
    navOrder: 70,
    bodyHtml: join(
      section(
        "core-api",
        "Core API",
        "The runtime bootstrap surface stays intentionally small.",
        "This is a feature, not a lack of ambition. Fewer top-level primitives mean fewer hidden rules.",
        table(
          ["API", "Purpose"],
          [
            [
              ic("Core.take(componentSource, name)"),
              "Register a component definition under a custom-element tag.",
            ],
            [
              ic("Core.take(pluginOrModule)"),
              "Install an application-wide plugin or module.",
            ],
            [
              ic("Core()"),
              "Initialize the runtime and mount registered elements found in the DOM.",
            ],
          ],
        ),
      ),
      section(
        "component-contract",
        "Component Contract",
        "A component controller returns one explicit object.",
        "That object is where runtime behavior becomes visible to the reader.",
        table(
          ["Field", "Meaning"],
          [
            [ic("state"), "Reactive component-local state."],
            [
              ic("methods"),
              "Template-callable methods and controller helpers.",
            ],
            [ic("props"), "Typed external inputs to the component."],
            [
              ic("events"),
              "Explicit listener tuples for refs, selectors, window, or other targets.",
            ],
            [
              ic("watchList"),
              "Optional list of state paths that should trigger updates.",
            ],
            [
              ic("created / mounted / updated / beforeDestroy / ..."),
              "Lifecycle hooks for effect timing and cleanup.",
            ],
          ],
        ),
      ),
      section(
        "template-api",
        "Template API",
        "The directive surface stays compact and intentionally literal.",
        "If you know the directives, you can read most templates without consulting framework internals.",
        table(
          ["Directive", "Syntax", "Purpose"],
          [
            [
              "Interpolation",
              escapeHtml("{{ value }}"),
              "Render expression output.",
            ],
            [
              "Dynamic attribute",
              escapeHtml(':href="url"'),
              "Bind an attribute from state or props.",
            ],
            [
              "Condition",
              escapeHtml('if="condition"'),
              "Render a conditional branch.",
            ],
            [
              "Loop",
              escapeHtml('loop="item in items"'),
              "Render a collection.",
            ],
            [
              "Ref",
              escapeHtml('ref="panel"'),
              "Expose an element on " + "$refs" + ".",
            ],
            [
              "Event",
              escapeHtml('onClick="handleClick"'),
              "Bind a controller method to a DOM event.",
            ],
          ],
        ),
      ),
      section(
        "limitations",
        "Known Limitations",
        "The product stays more trustworthy when limits are documented plainly.",
        "These are practical constraints you should factor into production design decisions.",
        table(
          ["Constraint", "Implication", "Workaround"],
          [
            [
              "No automatic CSS scoping",
              "Selectors are global.",
              "Prefix selectors with the component tag or a root class.",
            ],
            [
              "No SSR contract",
              "Rendering is browser-first.",
              "Deploy as a client-side application surface.",
            ],
            [
              "Custom element tags require a hyphen",
              "Names like myapp are invalid.",
              "Use tags such as app-view or status-card.",
            ],
            [
              "Deeply nested mutations may need deliberate structure",
              "Opaque mutation patterns are harder to reason about.",
              "Prefer clear parent reassignment or focused component boundaries.",
            ],
          ],
        ),
      ),
    ),
  },
  {
    path: "/packages",
    name: "documentation-packages",
    label: "Packages",
    description:
      "See how the official KoppaJS packages divide technical responsibilities across runtime, routing, build tooling, and documentation.",
    eyebrow: "Packages",
    headline:
      "The ecosystem is small enough that every package boundary matters.",
    lead: "The ecosystem page explains the product capability. This page documents the technical package boundaries that keep the runtime, router, build layer, and documentation system separate on purpose.",
    actions: [
      { label: "Architecture", path: "/architecture", variant: "primary" },
      { label: "FAQ", path: "/faq" },
    ],
    toc: [
      { id: "official-packages", label: "Official packages" },
      { id: "combinations", label: "Package combinations" },
      { id: "selection", label: "How to choose" },
    ],
    navOrder: 80,
    bodyHtml: join(
      section(
        "official-packages",
        "Official Packages",
        "Each package owns one main responsibility.",
        "That narrowness is what makes the whole system easier to reason about and safer to evolve independently.",
        join(
          cardGrid(
            2,
            ...ecosystemPackages.map((item) =>
              card(
                item.name,
                item.summary,
                item.role,
                item.installCommand
                  ? `<p class="koppa-text-muted">${ic(item.installCommand)}</p><p>${docLink(item.docsPath, "Read the docs page")}</p>`
                  : `<p>${docLink(item.docsPath, "Read the docs page")}</p>`,
              ),
            ),
          ),
          table(
            ["Package", "Role", "Responsibilities"],
            ecosystemPackages.map((item) => [
              ic(item.name),
              item.role,
              item.responsibilities.join("<br />"),
            ]),
          ),
        ),
      ),
      section(
        "combinations",
        "Package Combinations",
        "The dependency graph should match the product boundary, not future ambition.",
        "A clean package story makes it easier to understand why code exists and which contracts must stay stable.",
        table(
          ["Application boundary", "Recommended packages", "Why"],
          [
            [
              "Single browser surface",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-vite-plugin")}`,
              "Enough to register components and transform .kpa files without introducing routing concerns.",
            ],
            [
              "Route-based product",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-router")} + ${ic("@koppajs/koppajs-vite-plugin")}`,
              "Adds deterministic navigation, deep links, redirects, and outlet rendering when they are real requirements.",
            ],
            [
              "Website with integrated documentation",
              `${ic("@koppajs/koppajs-core")} + ${ic("@koppajs/koppajs-router")} + ${ic("@koppajs/koppajs-vite-plugin")} + ${ic("koppajs-documentation")}`,
              "Keeps docs routing, metadata, and navigation in the documentation package instead of reimplementing them in the website.",
            ],
          ],
        ),
      ),
      section(
        "selection",
        "Choosing Packages",
        "Introduce packages when the application boundary demands them.",
        "A production app should be explicit about why each package exists in the dependency graph and which runtime or build responsibility it adds.",
        list([
          `Use ${ic("@koppajs/koppajs-core")} for every KoppaJS app.`,
          `Add ${ic("@koppajs/koppajs-router")} once route ownership, redirects, or deep links are real product requirements.`,
          `Keep ${ic("@koppajs/koppajs-vite-plugin")} as the only package responsible for .kpa transformation.`,
          `Treat ${ic("koppajs-documentation")} as the shared explanation layer for the public site and standalone docs app.`,
        ]),
      ),
    ),
  },
  {
    path: "/architecture",
    name: "documentation-architecture",
    label: "Architecture",
    description:
      "Understand the intentional architecture behind KoppaJS: runtime boundaries, build-time transformation, contracts, and modular package ownership.",
    eyebrow: "Architecture",
    headline: "Intentional architecture means every layer has a job.",
    lead: "KoppaJS keeps product benefits like clarity, performance, and modularity grounded in technical boundaries: Components own UI units, Core owns runtime behavior, tooling owns build transformation, and packages communicate through explicit contracts.",
    actions: [
      { label: "FAQ", path: "/faq", variant: "primary" },
      { label: "Migration", path: "/migration" },
    ],
    toc: [
      { id: "layers", label: "System layers" },
      { id: "runtime-build-time", label: "Runtime and build-time" },
      { id: "contracts", label: "Contracts" },
    ],
    navOrder: 90,
    bodyHtml: join(
      section(
        "layers",
        "Layers",
        "The system is easier to evolve when each layer owns one concern.",
        "The public website introduces KoppaJS as a product. The documentation explains how each technical layer supports that product promise without pushing every responsibility into the core.",
        cardGrid(
          4,
          card(
            "Core",
            "Owns component registration, runtime boot, lifecycle, and reactive rendering.",
            "Runtime",
          ),
          card(
            "Router",
            "Owns path matching, navigation, active-link state, redirects, and outlet rendering.",
            "Navigation",
          ),
          card(
            "Vite Plugin",
            "Owns .kpa transformation before the application reaches the browser.",
            "Build",
          ),
          card(
            "Documentation",
            "Owns technical explanation, examples, route metadata, and the embeddable docs surface.",
            "Product surface",
          ),
        ),
      ),
      section(
        "runtime-build-time",
        "Runtime And Build-Time",
        "KoppaJS separates what runs in the browser from what can be resolved before it.",
        "That separation is the technical version of the product promise: less runtime overhead, fewer hidden behaviors, and clearer responsibility for each package.",
        table(
          ["Concern", "Runtime responsibility", "Build-time responsibility"],
          [
            [
              "Components",
              "Instantiate component behavior, state, lifecycle, and DOM updates.",
              "Transform .kpa files into modules the runtime can execute.",
            ],
            [
              "Routing",
              "Match paths, update active links, render outlets, and handle navigation.",
              "Keep route definitions typed and importable as ordinary application code.",
            ],
            [
              "Documentation",
              "Render documentation pages and navigation inside the selected shell.",
              "Export route metadata and route maps so websites do not duplicate docs structure.",
            ],
          ],
        ),
      ),
      section(
        "contracts",
        "Contracts",
        "Explicit contracts keep modularity from becoming accidental coupling.",
        "KoppaJS uses ordinary code, types, package exports, route definitions, and documentation pages to make boundaries inspectable. The goal is not ceremony; the goal is being able to tell which layer owns a behavior.",
        join(
          list([
            "Core exposes the runtime entry points used by applications and plugins.",
            "The router exposes route definitions and browser navigation behavior as a focused package.",
            "The Vite plugin owns .kpa transformation and should not leak hidden runtime decisions.",
            "The documentation package owns technical pages, route metadata, and embeddable docs integration.",
          ]),
          codeBlock(
            "Documentation integration surface",
            "ts",
            [
              "registerDocumentation();",
              "createDocumentationRoutes();",
              "getDocumentationRouteMeta();",
              "getDocumentationNavigationItems();",
              "installDocumentationRouteMap();",
            ].join("\n"),
          ),
        ),
      ),
    ),
  },
  {
    path: "/faq",
    name: "documentation-faq",
    label: "FAQ",
    description:
      "Answer practical questions about KoppaJS product fit, tradeoffs, boundaries, and production use without marketing language.",
    eyebrow: "FAQ",
    headline:
      "The useful questions are usually about boundaries and tradeoffs.",
    lead: "The website gives the product pitch. This section covers the questions that matter once you are deciding whether KoppaJS fits a real product surface.",
    actions: [
      { label: "Migration", path: "/migration", variant: "primary" },
      { label: "Overview", path: "/overview" },
    ],
    toc: [
      { id: "product-fit", label: "Product fit" },
      { id: "runtime-tradeoffs", label: "Runtime tradeoffs" },
      { id: "package-boundaries", label: "Package boundaries" },
    ],
    navOrder: 100,
    bodyHtml: join(
      section(
        "product-fit",
        "Product Fit",
        "What kind of application is KoppaJS good for?",
        "It fits products that value component-first structure, explicit boundaries, readable bootstrapping, deterministic routing, and a runtime model that maintainers can still inspect after several releases.",
        cardGrid(
          3,
          card(
            "Good fit",
            "Admin surfaces, documentation sites, internal tools, and long-lived browser apps where explicit control matters.",
            "Yes",
          ),
          card(
            "Weak fit",
            "Products that expect a huge plugin marketplace to choose architecture for them.",
            "Maybe not",
          ),
          card(
            "What it optimizes",
            "Clarity, explicit contracts, local component ownership, and a small mental model over framework spectacle.",
            "Intent",
          ),
        ),
      ),
      section(
        "runtime-tradeoffs",
        "Runtime Tradeoffs",
        "What do you trade for that clarity?",
        "You accept a smaller ecosystem, no hidden convenience layer, and a product philosophy that expects maintainers to own architectural decisions directly.",
        list([
          "There is no automatic CSS scoping layer.",
          "The product is browser-first rather than SSR-first.",
          "You introduce packages deliberately instead of pulling in an all-in-one framework surface.",
        ]),
      ),
      section(
        "package-boundaries",
        "Package Boundaries",
        "Why not merge the packages into one large framework?",
        "Because that would make the architecture easier to market and harder to maintain. KoppaJS keeps the contracts inspectable by letting runtime, router, build tooling, and documentation evolve as separate owned surfaces.",
        callout(
          "Short answer",
          "The ecosystem is intentionally modular because explicit boundaries are part of the product, not an implementation accident.",
          true,
        ),
      ),
    ),
  },
  {
    path: "/migration",
    name: "documentation-migration",
    label: "Migration",
    description:
      "Plan a sensible migration path into KoppaJS from a static Vite app, a prototype, or an earlier KoppaJS surface.",
    eyebrow: "Migration",
    headline: "A good migration plan preserves clarity while you move.",
    lead: "The safest migration path is incremental. Start with a narrow route or shell, keep the bootstrap visible, and prove the runtime model before expanding the surface.",
    actions: [
      { label: "Overview", path: "/overview", variant: "primary" },
      { label: "Packages", path: "/packages" },
    ],
    toc: [
      { id: "incremental-plan", label: "Incremental plan" },
      { id: "from-earlier-koppajs", label: "From earlier KoppaJS" },
      { id: "release-checks", label: "Release checks" },
    ],
    navOrder: 110,
    bodyHtml: join(
      section(
        "incremental-plan",
        "Incremental Plan",
        "Move one boundary at a time.",
        "Start with a route, shell, or widget where explicit ownership is useful. Avoid migrating the entire product surface before the runtime model is proven in your team context.",
        list(
          [
            "Introduce the KoppaJS Vite plugin and a minimal bootstrap in a small browser surface.",
            "Port a focused component group and keep the route boundary unchanged at first.",
            "Add the router only when route ownership or deep links become part of the migrated surface.",
            "Extract shared patterns after the first real feature ships, not before.",
          ],
          true,
        ),
      ),
      section(
        "from-earlier-koppajs",
        "From Earlier KoppaJS",
        "Treat older KoppaJS surfaces as architecture review opportunities.",
        "The current discipline is about removing ambiguity: route ownership, docs integration, package roles, and component contracts should all be tightened while you migrate.",
        cardGrid(
          2,
          card(
            "Remove hidden wiring",
            "Move startup logic into visible bootstrap files and explicit route definitions.",
            "Upgrade",
          ),
          card(
            "Normalize the package split",
            "Make runtime, router, tooling, and documentation boundaries match the current public model.",
            "Upgrade",
          ),
        ),
      ),
      section(
        "release-checks",
        "Release Checks",
        "Do not call a migrated surface done until the repository behavior matches production expectations.",
        "A migration is not complete when the UI renders. It is complete when the versioning, CI, route coverage, and build behavior are stable enough to ship repeatedly.",
        list([
          "Run linting, typechecking, unit tests, and a production build in CI.",
          "Verify deep links, not-found behavior, and route metadata in a browser test.",
          "Review package.json versions and dependency roles so the architecture is still legible from the manifest.",
        ]),
      ),
    ),
  },
] as const satisfies readonly DocumentationPageDefinition[];

export const documentationPageMap = new Map(
  documentationPages.map((page) => [page.path, page]),
) as Map<string, DocumentationPageDefinition>;

export const documentationNavigationRootPaths = [
  "/overview",
  "/getting-started",
  "/core-concepts",
  "/routing",
  "/tooling",
  "/examples",
  "/api",
  "/packages",
  "/architecture",
  "/faq",
  "/migration",
] as const;

export const getDocumentationPage = (
  path: string,
): DocumentationPageDefinition | undefined =>
  documentationPageMap.get(path === "/" ? "/overview" : path);
