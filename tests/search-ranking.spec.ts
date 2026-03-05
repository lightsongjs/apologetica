import { test, expect } from '@playwright/test';

test.describe('Search Result Ranking', () => {

  test('search "ioan" should show title matches first', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Open search modal
    await page.click('#floating-search-btn');
    await page.waitForSelector('#search-modal.show');

    // Search for "ioan"
    await page.fill('#modal-search-input', 'ioan');
    await page.waitForTimeout(500);

    // Wait for results
    await page.waitForSelector('#modal-results-container:not(.hidden)');

    // Get all personality results
    const personalityResults = await page.locator('#modal-personalitati-results a h3').allTextContents();

    console.log('Search results for "ioan":');
    personalityResults.forEach((result, i) => {
      console.log(`${i + 1}. ${result}`);
    });

    // First results should have "Ioan" in the title/name (primary field)
    // Not "Elisabeta" which only mentions Ioan in the description
    const firstResult = personalityResults[0].toLowerCase();

    // First result should contain "ioan" in the name itself
    expect(firstResult).toContain('ioan');

    // "Elisabeta" should NOT be the first result
    expect(firstResult).not.toContain('elisabeta');

    console.log('✓ Title matches appear first');
  });

  test('search "iisus" should prioritize exact name matches', async ({ page }) => {
    await page.goto('/');

    await page.click('#floating-search-btn');
    await page.waitForSelector('#search-modal.show');

    await page.fill('#modal-search-input', 'iisus');
    await page.waitForTimeout(500);

    await page.waitForSelector('#modal-results-container:not(.hidden)');

    const personalityResults = await page.locator('#modal-personalitati-results a h3').allTextContents();

    console.log('Search results for "iisus":');
    personalityResults.forEach((result, i) => {
      console.log(`${i + 1}. ${result}`);
    });

    // "Iisus Hristos" should be first (exact name match)
    const firstResult = personalityResults[0].toLowerCase();
    expect(firstResult).toContain('iisus');

    console.log('✓ Exact name matches prioritized');
  });

  test('search "tabor" should show place name matches first', async ({ page }) => {
    await page.goto('/');

    await page.click('#floating-search-btn');
    await page.waitForSelector('#search-modal.show');

    await page.fill('#modal-search-input', 'tabor');
    await page.waitForTimeout(500);

    await page.waitForSelector('#modal-results-container:not(.hidden)');

    // Check if locuri section is visible
    const locuriVisible = await page.locator('#modal-locuri-section:not(.hidden)').isVisible();

    if (locuriVisible) {
      const locuriResults = await page.locator('#modal-locuri-results a h3').allTextContents();

      console.log('Search results for "tabor" in Locuri:');
      locuriResults.forEach((result, i) => {
        console.log(`${i + 1}. ${result}`);
      });

      // First result should have "Tabor" in the name
      const firstResult = locuriResults[0].toLowerCase();
      expect(firstResult).toContain('tabor');

      console.log('✓ Place name matches prioritized');
    }
  });

});
