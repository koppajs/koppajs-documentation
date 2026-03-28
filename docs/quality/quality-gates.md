# Quality Gates

## Baseline gates

For the current repository scope, the baseline gates are:

- staged files: `lint-staged` via `.husky/pre-commit`
- commit messages: `commitlint` via `.husky/commit-msg`
- fast local repository check: `npm run check`
- full repository validation: `npm run validate`
- release candidate verification: `npm run release:check`
- `npm run typecheck`
- `npm run build`
- `npm run test:run`
- `npm run test:e2e` for UI, routing, or preview-sensitive changes
- tagged release automation: `.github/workflows/release.yml` reruns validation
  and checks tag/version alignment

## Gate escalation rules

Raise the quality bar when the repository grows:

- New extracted logic modules: add focused unit tests.
- Multi-page workflows or shared shell logic: add integration coverage.
- Routing, preview behavior, or browser-sensitive docs interactions: expand
  Playwright beyond the current smoke scope.
- Release process changes: update `RELEASE.md`, `CHANGELOG.md`, and the release
  workflow together.

## Review checklist

- Do setup instructions still work from a clean checkout?
- Does the documented architecture still match the code layout?
- Do specs still match observable behavior?
- Are current quality gates enough for the newest change?
- Do `CHANGELOG.md`, `RELEASE.md`, and the release workflow still agree on the
  release path?
- Do commit message rules and contributor examples still match
  `commitlint.config.mjs`?

## Ownership rule

Anyone changing code, tooling, or workflow is responsible for updating the
quality gates if the repository risk profile changes.
