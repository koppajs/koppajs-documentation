import { expect, test } from "@playwright/test";

test("renders the docs shell and navigates between the main documentation routes", async ({
  page,
}) => {
  let docsNav = page.getByLabel("Documentation navigation");

  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Pragmatic frontend made modular.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Complete user documentation in one place.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Open getting started" }).click();

  await expect(page).toHaveURL(/\/getting-started$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "From the new project to the running KoppaJS app.",
    }),
  ).toBeVisible();
  await expect(
    docsNav.getByRole("link", { name: "Getting started" }),
  ).toHaveAttribute("aria-current", "page");

  await docsNav.getByRole("link", { name: "Guides" }).click();

  await expect(page).toHaveURL(/\/guides$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Understand concepts and component behavior.",
    }),
  ).toBeVisible();
  await expect(docsNav.getByRole("link", { name: "Guides" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await docsNav.getByRole("link", { name: "Examples" }).click();

  await expect(page).toHaveURL(/\/examples$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "From mini patterns to the full todo app.",
    }),
  ).toBeVisible();

  await docsNav.getByRole("link", { name: "API" }).click();

  await expect(page).toHaveURL(/\/api$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The reference for runtime, directives and component contract.",
    }),
  ).toBeVisible();

  await docsNav.getByRole("link", { name: "Tooling" }).click();

  await expect(page).toHaveURL(/\/tooling$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build, typing and debugging workflow for KoppaJS.",
    }),
  ).toBeVisible();

  await docsNav.getByRole("link", { name: "Packages" }).click();

  await expect(page).toHaveURL(/\/packages$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "How the KoppaJS ecosystem is divided.",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Deutsch" }).click();
  docsNav = page.getByLabel("Dokumentationsnavigation");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Wie sich das KoppaJS-Ökosystem aufteilt.",
    }),
  ).toBeVisible();
  await expect(docsNav.getByRole("link", { name: "Pakete" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.goto("/missing");

  await expect(page).toHaveURL(/\/missing$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Diese Dokumentationsseite existiert nicht.",
    }),
  ).toBeVisible();
});
