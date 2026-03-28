# Decision Hierarchy

When guidance conflicts, use this precedence order:

1. Approved specs in `docs/specs/`
2. Governed root documents such as `README.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`
3. `ARCHITECTURE.md`, `TESTING_STRATEGY.md`, and `DEVELOPMENT_RULES.md`
4. Executable source, tests, and CI configuration
5. Temporary notes or discussion context

If a lower-precedence layer is more accurate than a higher-precedence one,
update the higher-precedence document in the same change.
