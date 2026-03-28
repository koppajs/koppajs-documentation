# Maintenance

Repository maintainers should treat these artifacts as coupled:

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `ARCHITECTURE.md`
- `TESTING_STRATEGY.md`
- `RELEASE.md`
- `docs/specs/documentation-website.md`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

If one of those files becomes inaccurate, update the others that depend on the
same workflow or runtime contract in the same change.
