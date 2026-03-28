# Module Boundaries

## Runtime Ownership

- `index.html`
  Declares the document shell and loads the TypeScript entrypoint.
- `src/main.ts`
  Registers components and pages, boots `Core()`, and starts one router.
- `src/components/app-shell.kpa`
  Owns the persistent website frame and route outlet.
- `src/pages/*.kpa`
  Own route-level documentation views.
- `src/app-routes.ts`
  Owns the route table and explicit fallback contract.

## Package Ownership

- `@koppajs/koppajs-core`
  Owns runtime boot and component registration.
- `@koppajs/koppajs-vite-plugin`
  Owns `.kpa` compilation inside Vite.
- `@koppajs/koppajs-router`
  Owns route resolution, active-link state, and navigation behavior.

## Test Ownership

- `tests/unit/`
  Covers route metadata and repository-local contracts.
- `tests/integration/`
  Covers bootstrap behavior and router startup wiring.
- `tests/e2e/`
  Covers the browser-visible route flow.
