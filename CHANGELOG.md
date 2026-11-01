# Change Log

All notable changes to **koppajs-documentation** are documented in this file.

This project uses a **manual, tag-driven release process**.
Only tagged versions represent official releases.

This changelog documents **intentional milestones and guarantees**,
not every internal refactor.

---

## [Unreleased]

This section is intentionally empty.

---

## [0.0.4]

- Pin CI and release jobs to Ubuntu 24.04 so Playwright 1.58.2 can install its
  Chromium dependencies after the `ubuntu-latest` migration to Ubuntu 26.04.
- Retain the English metadata and updated KoppaJS dependencies from the 0.0.3
  candidate, and verify the supported runner policy with regression tests.
- Leave the failed `v0.0.3` tag unchanged rather than rewriting release history.

---

## [0.0.3]

The tag was created, but hosted browser installation failed before validation
and GitHub Release creation because Playwright 1.58.2 does not support Ubuntu
26.04. Version 0.0.4 supersedes this candidate.

- Use English for the standalone HTML language, description, and document title.
- Add unit and browser regression checks for English document metadata.
- Update Core and Router peer/development ranges to `^3.0.12` and `^0.1.9`,
  and the Vite plugin development range to `^2.0.1`.

---

## [0.0.2] - Product Framing Alignment

**2026-06-24**

This release aligns the documentation copy with the updated public KoppaJS
product positioning while keeping the existing documentation route surface.

### Changed

- Refined the documentation overview around product-to-technical learning flow,
  package boundaries, runtime behavior, and documentation routes
- Updated Components, Tooling, Packages, Architecture, and FAQ copy to emphasize
  component-first design, explicit contracts, and runtime/build-time ownership
- Adjusted browser coverage for the updated documentation overview heading

---

## [0.0.1] - Initial Documentation Baseline

**2026-04-25**

- Prepared the initial `0.0.1` baseline for the documentation website with a
  routed KoppaJS shell, release workflow, commitlint hooks, quality docs, ADRs,
  and executable verification.

---
