# Release Process for `koppajs-documentation`

This document describes the repository-specific release workflow for
`koppajs-documentation`.

The project uses a manual, tag-driven release process.
Only tagged versions are official releases.

The effective flow is:

1. Finalize the release content on `develop`
2. Create a `release/*` branch from that state
3. Merge the release branch into `main`
4. Tag the release commit on `main` as `vX.Y.Z`
5. Push `main` and then push the tag
6. Let GitHub Actions validate and create the GitHub Release
7. Merge the updated `main` back into `develop`

## Release Model

This repository does not use automated versioning tools such as Changesets or
semantic-release.

The release is controlled by:

- the version in `package.json`
- the release entry in `CHANGELOG.md`
- the merge of the release-ready state into `main`
- the Git tag in the form `vX.Y.Z`
- the GitHub Actions workflow in `.github/workflows/release.yml`

Important consequences:

- a merge to `main` alone does not create a release
- a tag push is the technical release trigger
- the tag version must exactly match `package.json`
- the release workflow creates a GitHub Release only; it does not deploy or
  publish this project
- the official website may pin this repository by Git tag to embed a fixed
  documentation baseline
- when releasing both documentation and website for the same version, release
  `koppajs-documentation` first and wait for this workflow to pass before
  tagging `koppajs-website`
- after a successful release, `main` should be merged back into `develop`

Do not tag `develop`.
Do not tag the `release/*` branch.
Tag only the release commit that is already on `main`.

## Preconditions

Before cutting a release, ensure all of the following are true:

- the intended release scope is already complete on `develop`
- `package.json` contains the target version
- `CHANGELOG.md` contains the corresponding release notes
- `package-lock.json` is up to date
- the release content has been reviewed

Tooling expectations for local verification:

- Node.js >= 22
- npm >= 10

This repository enforces `engine-strict=true` through the tracked `.npmrc`, so
incompatible Node.js or npm versions should be treated as a release blocker.

## Hosted Runner Baseline

CI and release jobs pin `ubuntu-24.04`. Playwright 1.58.2 does not support
Ubuntu 26.04, so `ubuntu-latest` can fail while installing browser dependencies
before validation runs. Review Playwright OS support before changing this pin.
Do not move an existing version tag to repair a failed release; publish the fix
under a new patch version.

## Local Validation Before Branching

Before creating the release branch, validate the exact release candidate
locally.

Recommended commands:

```bash
npm install
npm run release:check
```

If Chromium is not installed locally yet, install it once:

```bash
npx playwright install chromium
```

## Step-by-Step Release Workflow

### 1. Finalize the release on `develop`

Ensure `develop` already contains the exact release content.

Typical release preparation includes:

- updating `package.json` to the intended release version
- moving the relevant notes into the final section in `CHANGELOG.md`
- committing any last release fixes

### 2. Create the `release/*` branch

Create a release branch from the validated `develop` state.

Example:

```bash
git checkout -b release/X.Y.Z
```

### 3. Merge the release branch into `main`

Merge `release/*` into `main` using the repository's normal process.

The critical requirement is:

- `main` must contain the final release commit before tagging

### 4. Tag the release commit on `main`

After the release branch has been merged, create the Git tag on the release
commit that is now on `main`.

Example:

```bash
git checkout main
git pull
git tag vX.Y.Z
```

### 5. Push `main` and the tag

Push the merged `main` branch and then the tag.

Example:

```bash
git push origin main
git push origin vX.Y.Z
```

### 6. Wait for the release workflow to finish

Verify that:

- the GitHub Actions release workflow passed
- the GitHub Release was created
- the version-check step confirmed tag and `package.json` alignment

### 7. Merge `main` back into `develop`

After the release has completed successfully, merge the updated `main` back
into `develop`.

If `koppajs-website` is also being released for the same version, complete this
documentation release first. Only tag the website after the documentation
workflow has passed and the documentation tag is available for the website
dependency pin.

## GitHub Workflow Behavior

The workflow `.github/workflows/release.yml` runs on pushed tags matching
`vX.Y.Z`.

For each matching tag it will:

1. install dependencies
2. install the Playwright Chromium browser
3. run `npm run validate`
4. verify that the tag version matches `package.json`
5. create a GitHub Release with generated release notes
