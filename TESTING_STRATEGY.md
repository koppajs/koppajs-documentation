# Testing Strategy

## Goals

The documentation website should be runnable, reviewable, and safe to change.
Tests exist to protect both the website shell and the route-level docs surface.

## Layers

- `npm run test:run`
  Runs Vitest for route metadata and bootstrap behavior.
- `npm run test:e2e`
  Builds the site and runs the Playwright browser smoke suite.
- `npm run check`
  Runs docs checks, linting, formatting, type checking, Vitest, and build.
- `npm run validate`
  Runs the full local baseline, including Playwright.

## Coverage Expectations

- Route table changes should update the Vitest route assertions.
- App bootstrap changes should update the Vitest integration test.
- Navigation or browser-visible copy changes should update the Playwright smoke
  suite when behavior or expectations move.

## CI

- GitHub Actions runs the main quality gate on Node.js 22 and 24.
- The browser smoke job runs on Node.js 22 with Playwright Chromium.
- The tag-driven release workflow reruns `npm run validate` before creating a
  GitHub Release.
