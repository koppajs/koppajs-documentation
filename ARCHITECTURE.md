# Architecture

## Purpose

`koppajs-documentation` is a routed KoppaJS website that acts as the canonical
long-form documentation surface for the ecosystem.

The repository owns:

- the website shell and route-level documentation pages
- cross-package explanation that should not be duplicated across package repos
- repository-local governance and contributor workflow docs

Package repos still own package-local runtime contracts, release notes, and
their most detailed implementation guidance.

## Runtime Layout

- `src/components/app-shell.kpa` owns the persistent frame and route outlet.
- `src/app-routes.ts` owns the top-level route table.
- `src/pages/*.kpa` owns route-level documentation views.
- `src/main.ts` registers the components, boots `Core()`, and starts
  `KoppajsRouter`.

## Package Boundaries

- `@koppajs/koppajs-core` owns component registration and runtime boot.
- `@koppajs/koppajs-vite-plugin` owns `.kpa` compilation in Vite.
- `@koppajs/koppajs-router` owns route matching, navigation, active-link state,
  and fallback rendering.

This repository should explain how those packages fit together, not recreate
their internal package-local docs verbatim.

## Verification Boundaries

- Vitest covers route metadata and app bootstrap behavior.
- Playwright covers browser-visible navigation and fallback behavior.
- `npm run check` is the primary local quality gate.

Support material:

- `docs/architecture/module-boundaries.md`
- `docs/quality/quality-gates.md`
- `docs/adr/0001-website-is-the-canonical-docs-surface.md`
