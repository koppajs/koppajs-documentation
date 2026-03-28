# ADR 0001: Website Is The Canonical Docs Surface

## Status

Accepted

## Context

The repository started as a root-documents-only anchor for the KoppaJS
ecosystem. That made cross-package documentation discoverable, but not
executable.

The package repositories and `bws-website` showed that the strongest KoppaJS
documentation happens where actual runtime wiring can be exercised.

## Decision

This repository will host a real routed KoppaJS website as the canonical home
for ecosystem-level documentation.

Package-local contracts remain in their own repositories, especially
`koppajs-core`, `koppajs-vite-plugin`, and `koppajs-router`.

## Consequences

- cross-package docs can now be verified through runtime tests
- this repo now needs release, quality, and browser-test workflows
- package repos still remain the source of truth for package-internal details
