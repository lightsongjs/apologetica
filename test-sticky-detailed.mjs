import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 }
  });
  const page = await context.newPage();

  console.log('📱 Opening page...');
  await page.goto('http://localhost:4321/personalitati/ignatie-teoforul');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot 1: Initial view
  console.log('📸 1. Initial page view');
  await page.screenshot({ path: 'sticky-test-1-initial.png', fullPage: false });

  // Scroll to "Surse și scrieri" section
  console.log('📜 Scrolling to Surse și scrieri section...');
  await page.locator('h2:has-text("Surse și scrieri")').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  console.log('📸 2. At Surse și scrieri header');
  await page.screenshot({ path: 'sticky-test-2-at-header.png', fullPage: false });

  // Scroll down 400px to get into the list items
  console.log('⬇️ Scrolling down 400px into the writings list...');
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(500);

  console.log('📸 3. Scrolled down - header should be sticky at top');
  await page.screenshot({ path: 'sticky-test-3-scrolled-down.png', fullPage: false });

  // Scroll up slightly to second writing item
  console.log('⬆️ Scrolling up to second writing...');
  await page.evaluate(() => window.scrollBy(0, -150));
  await page.waitForTimeout(500);

  console.log('📸 4. At second writing - header should still be sticky');
  await page.screenshot({ path: 'sticky-test-4-second-item.png', fullPage: false });

  // Check computed styles
  console.log('\n🔍 Checking computed styles of header...');
  const headerStyles = await page.locator('h2:has-text("Surse și scrieri")').evaluate(el => {
    const parent = el.parentElement;
    const computed = window.getComputedStyle(parent);
    return {
      position: computed.position,
      top: computed.top,
      zIndex: computed.zIndex,
      backgroundColor: computed.backgroundColor,
      classes: parent.className
    };
  });
  console.log('Header parent styles:', JSON.stringify(headerStyles, null, 2));

  console.log('\n✅ Screenshots saved:');
  console.log('   1. sticky-test-1-initial.png');
  console.log('   2. sticky-test-2-at-header.png');
  console.log('   3. sticky-test-3-scrolled-down.png (SHOULD show sticky header)');
  console.log('   4. sticky-test-4-second-item.png (SHOULD show sticky header)');

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\n✅ Test complete!');
})();
