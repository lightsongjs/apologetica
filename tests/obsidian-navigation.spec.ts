import { test, expect } from '@playwright/test';

test.describe('Obsidian-style Navigation', () => {

  test('bottom nav search opens modal instead of navigating', async ({ page }) => {
    // Start on home page
    await page.goto('/');

    // Click the bottom nav search button
    await page.click('#bottom-nav-search-btn');

    // Modal should be visible
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // URL should NOT have changed
    expect(page.url()).toContain('/');
    expect(page.url()).not.toContain('/cautare');
  });

  test('floating search button opens modal', async ({ page }) => {
    // Navigate to any content page
    await page.goto('/');
    await page.click('a[href="/conversatii"]');

    // Click floating search button
    await page.click('#floating-search-btn');

    // Modal should be visible
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // URL should NOT have changed
    expect(page.url()).toContain('/conversatii');
  });

  test('modal search results navigation works', async ({ page }) => {
    // Start on home page
    await page.goto('/');

    // Open search modal via bottom nav
    await page.click('#bottom-nav-search-btn');

    // Wait for modal to be visible
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // Type in search
    await page.fill('#modal-search-input', 'Tabor');

    // Wait for results
    await page.waitForSelector('#modal-results-container:not(.hidden)', { timeout: 5000 });

    // Click first result (should navigate)
    const firstResult = page.locator('#modal-results-container a').first();
    await firstResult.click();

    // Should navigate to the result page
    await page.waitForURL(/\/(locuri|personalitati|teme|conversatii)\//);

    // Modal should be closed
    await expect(page.locator('#search-modal')).not.toHaveClass(/show/);
  });

  test('history navigation works correctly (no /cautare in history)', async ({ page }) => {
    // Start on home page
    await page.goto('/');
    const homeUrl = page.url();

    // Open search modal via bottom nav
    await page.click('#bottom-nav-search-btn');
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // Search for something and click result
    await page.fill('#modal-search-input', 'Tabor');
    await page.waitForSelector('#modal-results-container:not(.hidden)');

    const firstResult = page.locator('#modal-results-container a').first();
    await firstResult.click();
    await page.waitForURL(/\/(locuri|personalitati|teme|conversatii)\//);
    const firstPageUrl = page.url();

    // Open search again
    await page.click('#bottom-nav-search-btn');
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // Search for something else and click result
    await page.fill('#modal-search-input', 'Irineu');
    await page.waitForSelector('#modal-results-container:not(.hidden)');

    const secondResult = page.locator('#modal-results-container a').first();
    await secondResult.click();
    await page.waitForURL(/\/(locuri|personalitati|teme|conversatii)\//);
    const secondPageUrl = page.url();

    // Now go back - should go to first result page, NOT /cautare
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should be on the first result page
    expect(page.url()).toBe(firstPageUrl);
    expect(page.url()).not.toContain('/cautare');

    // Go back again - should go to home
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should be on home page
    expect(page.url()).toBe(homeUrl);
  });

  test('modal closes with X button', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.click('#bottom-nav-search-btn');
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // Close with X button
    await page.click('#close-search-modal');

    // Modal should be hidden
    await expect(page.locator('#search-modal')).not.toHaveClass(/show/);
  });

  test('modal closes with Escape key', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.click('#bottom-nav-search-btn');
    await expect(page.locator('#search-modal')).toHaveClass(/show/);

    // Close with Escape
    await page.keyboard.press('Escape');

    // Modal should be hidden
    await expect(page.locator('#search-modal')).not.toHaveClass(/show/);
  });

  test('search input is focused when modal opens', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.click('#bottom-nav-search-btn');

    // Search input should be focused
    await expect(page.locator('#modal-search-input')).toBeFocused();
  });

  test('floating button is visible on content pages', async ({ page }) => {
    // Navigate to a conversation page
    await page.goto('/');
    await page.click('a[href="/conversatii"]');
    await page.click('a[href*="/conversatii/"]');

    // Floating search button should be visible
    await expect(page.locator('#floating-search-btn')).toBeVisible();
  });

  test('search works across all collections', async ({ page }) => {
    await page.goto('/');

    // Open search
    await page.click('#bottom-nav-search-btn');
    await page.fill('#modal-search-input', 'sf');

    // Wait for results
    await page.waitForSelector('#modal-results-container:not(.hidden)');

    // Should have at least one section visible
    const hasConversations = await page.locator('#modal-conversations-section:not(.hidden)').isVisible().catch(() => false);
    const hasTeme = await page.locator('#modal-teme-section:not(.hidden)').isVisible().catch(() => false);
    const hasPersonalitati = await page.locator('#modal-personalitati-section:not(.hidden)').isVisible().catch(() => false);
    const hasLocuri = await page.locator('#modal-locuri-section:not(.hidden)').isVisible().catch(() => false);

    // At least one should be visible
    expect(hasConversations || hasTeme || hasPersonalitati || hasLocuri).toBe(true);
  });

});
