
import { test, expect } from '@playwright/test';
import path from 'path';
const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
    await page.goto(`${UI_URL}`);

  // Expect a title "to contain" a substring.
  await page.getByRole("link", { name: "Sign In"}).click();
  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();
  await page.locator("[name=email]").fill("test3@test.com");
  await page.locator("[name=password]").fill("1234567");

  await page.getByRole("button", { name: "Login"}).click();

  await expect(page.getByText("User signin successful")).toBeVisible();
});

test('should allow user to add a hotel', async ({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test city");
    await page.locator('[name="country"]').fill("Test country");
    await page.locator('[name="description"]').fill("Test description of the hotel.");
    await page.locator('[name="pricePerNight"]').fill("120");
    await page.selectOption('select[name="starRating"]', "3");

    await page.getByText('Budget').click();

    await page.getByLabel('Free Wifi').check();
    await page.getByLabel('Parking').check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("1");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "test1.jpg"),
        path.join(__dirname, "files", "test2.png"),
    ]);

    await page.getByRole('button', { name: "Save"}).click();

    await expect(page.getByText("Hotel Saved...!!!")).toBeVisible();
});

test('should display hotels', async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await expect(page.getByText("Test Hotel").first()).toBeVisible();
    await expect(page.getByText("Test description of the hotel.").first()).toBeVisible();
    await expect(page.getByText('Test description of the').first()).toBeVisible();
    await expect(page.getByText("Test city, Test country").first()).toBeVisible();
    await expect(page.getByText("Budget").first()).toBeVisible();
    await expect(page.getByText("$120 per night").first()).toBeVisible();
    await expect(page.getByText("2 adult, 1 children").first()).toBeVisible();
    await expect(page.getByText("3 Star rating").first()).toBeVisible();

    await expect(page.getByRole("link", { name: "View Details"}).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Add Hotel"})).toBeVisible();

});

test('should edit hotels', async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await page.getByRole('link', { name: 'View Details'}).first().click();

    await page.waitForSelector('[name="name"]', { state: 'attached'});

    await expect(page.locator('[name="name"]')).toHaveValue('Test Hotel');

    await page.locator('[name="name"]').first().fill('Test hotel updated');
    await page.getByRole('button', { name: 'Save'}).click();

    await expect(page.getByText('Hotel details are updated.')).toBeVisible();

    await page.reload();
    await expect(page.locator('[name="name"]')).toHaveValue('Test hotel updated');
    await page.locator('[name="name"]').fill('Test Hotel');
    await page.getByRole('button', { name: 'Save'}).click();

    await expect(page.getByText('Hotel details are updated.')).toBeVisible();

});