import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("test3@test.com");
  await page.locator("[name=password]").fill("1234567");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("User signin successful")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going").fill("test");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("1 Hotels found. in test")).toBeVisible();
  await expect(page.getByText("Test Hotel")).toBeVisible();
});