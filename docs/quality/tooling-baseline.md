# Tooling Baseline

The repository currently standardizes on:

- Node.js >= 22
- npm >= 10
- Vite for development and production builds
- `@koppajs/koppajs-vite-plugin` for `.kpa` compilation
- TypeScript for source and tooling type safety
- ESLint plus Prettier for static quality gates
- Vitest for unit and integration testing
- Playwright for browser smoke coverage
- GitHub Actions for Node.js 22/24 validation and release checks
