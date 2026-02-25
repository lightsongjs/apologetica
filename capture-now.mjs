import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 400, height: 900 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4321/personalitati/ignatie-teoforul');
  await page.waitForLoadState('networkidle');

  // Scroll to same position user is viewing
  await page.locator('h2:has-text("Surse și scrieri")').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);

  const timestamp = Date.now();
  const filename = `screenshot-${timestamp}.png`;
  await page.screenshot({ path: filename, fullPage: false });

  console.log(`📸 Screenshot saved: ${filename}`);

  await browser.close();
})();
