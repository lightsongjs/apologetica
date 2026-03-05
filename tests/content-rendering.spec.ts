import { test, expect } from '@playwright/test';

test.describe('Content Rendering', () => {
  test('personality page should show bio content for Andrei', async ({ page }) => {
    await page.goto('http://localhost:4323/personalitati/andrei-apostolul');

    // Check that bio section exists and has content
    const bioSection = page.locator('section:has(h2:has-text("Biografie"))');
    await expect(bioSection).toBeVisible();

    // Check for actual bio text content
    await expect(bioSection).toContainText('Sfântul Apostol Andrei');
    await expect(bioSection).toContainText('Cel Întâi Chemat');
  });

  test('place page should show description content for Antiohia', async ({ page }) => {
    await page.goto('http://localhost:4323/locuri/antiohia');

    // Check that description section exists and has content
    const descSection = page.locator('section:has(h2:has-text("Descriere"))');
    await expect(descSection).toBeVisible();

    // Check for actual description text content
    await expect(descSection).toContainText('Antiohia Siriei');
    await expect(descSection).toContainText('Imperiului Roman');
  });

  test('working personality page should show content for Ignatie', async ({ page }) => {
    await page.goto('http://localhost:4323/personalitati/ignatie-teoforul');

    // Check that bio section exists and has content
    const bioSection = page.locator('section:has(h2:has-text("Biografie"))');
    await expect(bioSection).toBeVisible();

    // Check for actual bio text
    await expect(bioSection).toContainText('Ignatie');
  });
});
