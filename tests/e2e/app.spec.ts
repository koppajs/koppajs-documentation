import { expect, test } from "@playwright/test";

test("renders the docs shell and navigates through the 0.0.2 route structure", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/overview$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Understand how KoppaJS works before you wire an app.",
    }),
  ).toBeVisible();
  await expect(page.getByLabel("Documentation navigation")).toBeVisible();
  const [htmlWidth, htmlScrollWidth, docsGridBox] = await Promise.all([
    page.evaluate(() => document.documentElement.clientWidth),
    page.evaluate(() => document.documentElement.scrollWidth),
    page.locator(".documentation-shell__grid").boundingBox(),
  ]);

  expect(docsGridBox).not.toBeNull();
  expect(docsGridBox!.width).toBeLessThanOrEqual(htmlWidth + 1);
  expect(htmlScrollWidth).toBeLessThanOrEqual(htmlWidth + 1);

  await page
    .getByLabel("Documentation navigation")
    .getByRole("link", { name: "Getting Started" })
    .click();

  await expect(page).toHaveURL(/\/getting-started$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "From an empty directory to a readable application shell.",
    }),
  ).toBeVisible();

  await page
    .getByLabel("Documentation navigation")
    .getByRole("link", { name: "Installation" })
    .click();

  await expect(page).toHaveURL(/\/getting-started\/installation$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Install the supported baseline without hidden setup.",
    }),
  ).toBeVisible();

  await page
    .getByLabel("Documentation navigation")
    .getByRole("link", { name: "Core Concepts" })
    .click();

  await expect(page).toHaveURL(/\/core-concepts$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "KoppaJS stays understandable when each concept keeps one job.",
    }),
  ).toBeVisible();

  await page
    .getByLabel("Documentation navigation")
    .getByRole("link", { name: "API" })
    .click();

  await expect(page).toHaveURL(/\/api$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Use the API page when you need exact contract language.",
    }),
  ).toBeVisible();

  await page.goto("/missing-route");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "This documentation route does not exist.",
    }),
  ).toBeVisible();
});
