# Documentation Website

- Status: Approved
- Owner: repository maintainers

## Scope

This spec defines the runtime and verification baseline for the KoppaJS
documentation website hosted in this repository.

## Behavior

- Owned documentation prose and standalone HTML metadata must use English. The
  standalone document declares `lang="en"`; routes and user-authored values remain
  unchanged.
- The repository must provide a Vite-powered KoppaJS application shell.
- The app shell must render routed documentation pages through
  `@koppajs/koppajs-router`.
- The top-level route set must include overview, getting started, package
  guidance, testing guidance, and an explicit catch-all fallback route.
- The website must explain the roles of `@koppajs/koppajs-core`,
  `@koppajs/koppajs-vite-plugin`, and `@koppajs/koppajs-router` without
  duplicating package-local release or implementation contracts verbatim.

## Constraints

- Repository-local minimum Node.js version: `>=22`
- Maintainer default may stay on Node.js 22 through `.nvmrc`
- Local quality gates must include linting, formatting, type checking, and
  Vitest
- Browser verification must be available through Playwright
- Hosted CI and release jobs pin `ubuntu-24.04`, which supports the installed
  Playwright browser-dependency installer. Review support before updating it.

## Edge Cases

- Unknown documentation paths must resolve through an explicit not-found route.
- The router bootstrap must wait until the app outlet exists before starting.
- Route links must stay compatible with a configured Vite `BASE_URL`.

## Validation or Acceptance Criteria

- `npm run check` passes locally
- `npm run test:e2e` passes locally when Playwright Chromium is installed
- CI runs the quality gate on Node.js 22 and 24
