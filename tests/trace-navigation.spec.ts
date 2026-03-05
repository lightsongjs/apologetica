import { test, expect } from '@playwright/test';

test.describe('Full Navigation Trace', () => {

  test('record complete user journey with tracing', async ({ page }) => {
    // Enable slow motion to see what's happening
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    console.log('=== STEP 1: Starting on home page ===');
    console.log('Current URL:', page.url());
    await page.screenshot({ path: 'trace-output/01-home.png', fullPage: true });

    // Check if bottom nav exists
    const bottomNav = page.locator('#bottom-nav-search-btn');
    console.log('Bottom nav search button exists:', await bottomNav.count());

    console.log('=== STEP 2: Clicking bottom nav search button ===');
    await bottomNav.click();
    await page.waitForTimeout(1000);
    console.log('Current URL after click:', page.url());

    // Check if modal opened
    const modal = page.locator('#search-modal');
    const modalClasses = await modal.getAttribute('class');
    console.log('Modal classes:', modalClasses);
    console.log('Modal has "show" class:', modalClasses?.includes('show'));
    await page.screenshot({ path: 'trace-output/02-modal-opened.png', fullPage: true });

    // Check if we're still on home or if we navigated
    if (page.url().includes('/cautare')) {
      console.log('❌ ERROR: Navigated to /cautare instead of opening modal!');
      await page.screenshot({ path: 'trace-output/ERROR-navigated-to-cautare.png', fullPage: true });
    } else {
      console.log('✓ Good: Still on home page, modal should be open');
    }

    console.log('=== STEP 3: Typing search query ===');
    const searchInput = page.locator('#modal-search-input');
    await searchInput.fill('Tabor');
    await page.waitForTimeout(1500);
    console.log('Search query entered: Tabor');
    await page.screenshot({ path: 'trace-output/03-search-results.png', fullPage: true });

    // Check if results appeared
    const resultsContainer = page.locator('#modal-results-container');
    const resultsVisible = await resultsContainer.isVisible();
    console.log('Results container visible:', resultsVisible);

    console.log('=== STEP 4: Clicking first search result ===');
    const firstResult = page.locator('#modal-results-container a').first();
    const firstResultHref = await firstResult.getAttribute('href');
    console.log('First result href:', firstResultHref);

    await firstResult.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const pageAUrl = page.url();
    console.log('Navigated to Page A:', pageAUrl);
    await page.screenshot({ path: 'trace-output/04-page-a.png', fullPage: true });

    console.log('=== STEP 5: Opening search again from Page A ===');
    // Check if floating button or bottom nav exists
    const floatingBtn = page.locator('#floating-search-btn');
    const floatingBtnVisible = await floatingBtn.isVisible();
    console.log('Floating search button visible:', floatingBtnVisible);

    if (floatingBtnVisible) {
      await floatingBtn.click();
    } else {
      const bottomNavAgain = page.locator('#bottom-nav-search-btn');
      console.log('Clicking bottom nav search again');
      await bottomNavAgain.click();
    }

    await page.waitForTimeout(1000);
    console.log('Current URL after opening search again:', page.url());
    await page.screenshot({ path: 'trace-output/05-modal-opened-again.png', fullPage: true });

    console.log('=== STEP 6: Searching for second term ===');
    const searchInputAgain = page.locator('#modal-search-input');
    await searchInputAgain.fill('Irineu');
    await page.waitForTimeout(1500);
    console.log('Search query entered: Irineu');
    await page.screenshot({ path: 'trace-output/06-second-search-results.png', fullPage: true });

    console.log('=== STEP 7: Clicking second search result ===');
    const secondResult = page.locator('#modal-results-container a').first();
    const secondResultHref = await secondResult.getAttribute('href');
    console.log('Second result href:', secondResultHref);

    await secondResult.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const pageBUrl = page.url();
    console.log('Navigated to Page B:', pageBUrl);
    await page.screenshot({ path: 'trace-output/07-page-b.png', fullPage: true });

    console.log('=== STEP 8: Going back (browser back button) ===');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const afterBackUrl = page.url();
    console.log('After back button, URL is:', afterBackUrl);
    await page.screenshot({ path: 'trace-output/08-after-back.png', fullPage: true });

    // Check where we ended up
    if (afterBackUrl === pageAUrl) {
      console.log('✓ SUCCESS: Back button took us to Page A (Mount Tabor)');
    } else if (afterBackUrl.includes('/cautare')) {
      console.log('❌ ERROR: Back button took us to /cautare page');
    } else if (afterBackUrl.includes('/personalitati') && !afterBackUrl.includes('irineu')) {
      console.log('❌ ERROR: Back button took us to personalitati index');
    } else {
      console.log('❓ UNEXPECTED: Back button took us to:', afterBackUrl);
    }

    console.log('=== STEP 9: Going back again ===');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const afterSecondBackUrl = page.url();
    console.log('After second back, URL is:', afterSecondBackUrl);
    await page.screenshot({ path: 'trace-output/09-after-second-back.png', fullPage: true });

    console.log('\n=== NAVIGATION HISTORY SUMMARY ===');
    console.log('1. Started at:', '/');
    console.log('2. Went to Page A:', pageAUrl);
    console.log('3. Went to Page B:', pageBUrl);
    console.log('4. Back button #1:', afterBackUrl);
    console.log('5. Back button #2:', afterSecondBackUrl);
    console.log('================================\n');
  });

});
