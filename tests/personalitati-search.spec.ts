import { test, expect } from '@playwright/test';

test.describe('Personalitati Search', () => {
  test('should filter personalities in real-time when typing "manase"', async ({ page }) => {
    // Navigate to the personalitati page
    await page.goto('/personalitati');

    // Wait for the page to load
    await page.waitForSelector('.personality-card');

    // Count initial cards
    const initialCards = await page.locator('.personality-card').count();
    console.log(`Initial cards count: ${initialCards}`);

    // Get the search input
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();

    // Type "manase" in the search box
    await searchInput.fill('manase');

    // Wait a bit for the filtering to happen
    await page.waitForTimeout(100);

    // Check visible cards
    const visibleCards = await page.locator('.personality-card:visible').count();
    console.log(`Visible cards after search: ${visibleCards}`);

    // Verify that at least one card is visible (Regele Manase)
    expect(visibleCards).toBeGreaterThan(0);

    // Verify that the visible card contains "Manase"
    const visibleCard = page.locator('.personality-card:visible').first();
    await expect(visibleCard).toContainText('Manase');
  });

  test('should show all personalities when search is empty', async ({ page }) => {
    await page.goto('/personalitati');
    await page.waitForSelector('.personality-card');

    const searchInput = page.locator('#search-input');

    // Type something first
    await searchInput.fill('test');
    await page.waitForTimeout(100);

    // Clear the search
    await searchInput.fill('');
    await page.waitForTimeout(100);

    // All cards should be visible
    const visibleCards = await page.locator('.personality-card:visible').count();
    const totalCards = await page.locator('.personality-card').count();

    expect(visibleCards).toBe(totalCards);
  });

  test('should show "no results" message when no matches found', async ({ page }) => {
    await page.goto('/personalitati');
    await page.waitForSelector('.personality-card');

    const searchInput = page.locator('#search-input');
    const noResults = page.locator('#no-results');

    // Initially hidden
    await expect(noResults).toBeHidden();

    // Type something that doesn't match
    await searchInput.fill('xyznonexistent');
    await page.waitForTimeout(100);

    // No results message should be visible
    await expect(noResults).toBeVisible();
    expect(await page.locator('.personality-card:visible').count()).toBe(0);
  });

  test('should search by title as well as name', async ({ page }) => {
    await page.goto('/personalitati');
    await page.waitForSelector('.personality-card');

    const searchInput = page.locator('#search-input');

    // Search for "rege" which is in the title
    await searchInput.fill('rege');
    await page.waitForTimeout(100);

    const visibleCards = await page.locator('.personality-card:visible').count();
    console.log(`Cards visible when searching "rege": ${visibleCards}`);

    // Should find at least one card (Regele Manase)
    expect(visibleCards).toBeGreaterThan(0);
  });
});
