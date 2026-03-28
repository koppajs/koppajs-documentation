<a id="readme-top"></a>

<div align="center">
  <img src="https://public-assets-1b57ca06-687a-4142-a525-0635f7649a5c.s3.eu-central-1.amazonaws.com/koppajs/koppajs-logo-text-900x226.png" width="500" alt="KoppaJS Logo">
</div>

<br>

<div align="center">
  <a href="https://github.com/koppajs/koppajs-documentation/actions"><img src="https://img.shields.io/github/actions/workflow/status/koppajs/koppajs-documentation/ci.yml?branch=main&style=flat-square" alt="CI Status"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square" alt="License"></a>
</div>

<br>

<div align="center">
  <h1 align="center">koppajs-documentation</h1>
  <h3 align="center">Canonical documentation website for the KoppaJS ecosystem</h3>
  <p align="center">
    <i>The shared landing point for long-form docs, package guidance, and ecosystem-level explanations.</i>
  </p>
</div>

<br>

<div align="center">
  <p align="center">
    <a href="https://github.com/koppajs/koppajs-core">KoppaJS Core</a>
    &middot;
    <a href="https://github.com/koppajs/koppajs-vite-plugin">Vite Plugin</a>
    &middot;
    <a href="https://github.com/koppajs/koppajs-router">Router</a>
    &middot;
    <a href="https://github.com/koppajs/create-koppajs">create-koppajs</a>
    &middot;
    <a href="https://github.com/koppajs/koppajs-documentation/issues">Issues</a>
  </p>
</div>

<br>

<details>
<summary>Table of Contents</summary>
  <ol>
    <li><a href="#what-is-this-repository">What is this repository?</a></li>
    <li><a href="#requirements">Requirements</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#documentation-surface">Documentation Surface</a></li>
    <li><a href="#testing--quality">Testing & Quality</a></li>
    <li><a href="#architecture-governance">Architecture & Governance</a></li>
    <li><a href="#community-contribution">Community & Contribution</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

---

## What is this repository?

`koppajs-documentation` is the dedicated documentation website for the KoppaJS
ecosystem.

It now combines two responsibilities in one place:

- a routed KoppaJS application shell for long-form framework documentation
- the canonical root repository docs and governance layer for the docs site itself

That keeps package repos focused on package-local contracts while broader
guides, onboarding flows, and cross-package explanations have a real application
surface to live in and be tested against.

---

## Requirements

- Node.js >= 22
- npm >= 10

Install the Playwright browser locally if you want to run end-to-end tests:

```bash
npx playwright install chromium
```

---

## Getting Started

```bash
npm install
npm run dev
```

Useful commands:

- `npm run check`
- `npm run test:run`
- `npm run test:e2e`
- `npm run build`
- `npm run serve`
- `npm run validate`
- `npm run release:check`

---

## Documentation Surface

The website is intentionally small but real:

- `src/components/app-shell.kpa` owns the persistent frame, hero section, and route outlet
- `src/app-routes.ts` defines the documentation routes and explicit catch-all page
- `src/pages/*.kpa` contains route-level documentation pages
- `src/main.ts` registers KoppaJS components, boots `Core()`, and starts the router
- `RELEASE.md` and `docs/quality/` define the current release and verification baseline

Current top-level routes:

- `/`
- `/getting-started`
- `/packages`
- `/testing`
- `*` -> not-found fallback

The main implementation references for the site are:

- `@koppajs/koppajs-core`
- `@koppajs/koppajs-vite-plugin`
- `@koppajs/koppajs-router`

---

## Testing & Quality

The repository now treats the docs website as executable surface area:

- `Vitest` covers route metadata and bootstrap behavior
- `Playwright` covers real browser navigation and not-found handling
- GitHub Actions runs the main quality gate on Node.js 22 and 24
- the browser smoke test runs on Node.js 22 with Playwright Chromium

Local quality baseline:

```bash
npm run check
```

---

## Architecture & Governance

Project intent, contributor rules, runtime boundaries, and documentation
contracts live in the local repo meta layer:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DECISION_HIERARCHY.md](./DECISION_HIERARCHY.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [RELEASE.md](./RELEASE.md)
- [ROADMAP.md](./ROADMAP.md)
- [docs/adr/README.md](./docs/adr/README.md)
- [docs/architecture/README.md](./docs/architecture/README.md)
- [docs/meta/README.md](./docs/meta/README.md)
- [docs/quality/README.md](./docs/quality/README.md)
- [docs/specs/README.md](./docs/specs/README.md)
- [docs/specs/repository-documentation-contract.md](./docs/specs/repository-documentation-contract.md)
- [docs/specs/documentation-website.md](./docs/specs/documentation-website.md)

The file-shape contract for `README.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`,
and `CONTRIBUTING.md` is defined in
[docs/specs/repository-documentation-contract.md](./docs/specs/repository-documentation-contract.md).

Run the local document guard before committing:

```bash
npm run check:docs
```

---

## Community & Contribution

Issues and pull requests are welcome:

[https://github.com/koppajs/koppajs-documentation/issues](https://github.com/koppajs/koppajs-documentation/issues)

Contributor workflow details live in [CONTRIBUTING.md](./CONTRIBUTING.md).

Community expectations live in [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## License

Apache License 2.0 — © 2026 KoppaJS, Bastian Bensch
