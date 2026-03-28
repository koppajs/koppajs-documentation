# Development Rules

## Scope

These rules apply to repository maintenance, documentation work, and any future code or content added to this repository.

## Documentation Contract Rules

- `README.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, and `CONTRIBUTING.md` are governed by `docs/specs/repository-documentation-contract.md`.
- If one of those files changes shape, update the spec and `scripts/check-doc-contract.mjs` in the same change.
- Keep official KoppaJS branding, logo usage, and section order consistent across governed root documents.
- Repository-specific guidance must stay local to this repository so contributors do not need other repos to recover the rules.

## Change Safety Rules

- Prefer explicit repository contracts over implicit convention.
- Update contributor docs whenever workflow or quality-gate behavior changes.
- Update routes, page content, and tests together when the documentation
  website surface changes.
- Keep package responsibility statements aligned with `koppajs-core`,
  `koppajs-vite-plugin`, and `koppajs-router` instead of inventing root-local
  duplicates.
- Run the local document check before committing changes to governed files.
