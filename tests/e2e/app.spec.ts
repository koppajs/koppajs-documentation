import { expect, test } from "@playwright/test";

test("renders the docs shell and navigates between the main documentation routes", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Document the framework where it is used.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "A documentation website with runtime contracts.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Get started" }).click();

  await expect(page).toHaveURL(/\/getting-started$/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Start from a real KoppaJS app shell.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Getting Started" }),
  ).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "Packages" }).click();

  await expect(page).toHaveURL(/\/packages$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Core, Vite plugin, router." }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Testing" }).click();

  await expect(page).toHaveURL(/\/testing$/);
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Tests are part of the docs contract.",
    }),
  ).toBeVisible();

  await page.goto("/missing");

  await expect(page).toHaveURL(/\/missing$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Page not found." }),
  ).toBeVisible();
});
