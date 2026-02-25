import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Opening browser...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 400, height: 900 }
  });

  const page = await context.newPage();

  console.log('📱 Loading page...');
  await page.goto('http://localhost:4321/personalitati/ignatie-teoforul');
  await page.waitForLoadState('networkidle');

  console.log('\n✅ Page loaded!');
  console.log('📱 Browser is open - test the sticky headers by scrolling.');
  console.log('💡 Tell me when you want a screenshot, and I\'ll capture it.');
  console.log('\n⏳ Keeping browser open indefinitely...');
  console.log('   Close the browser window when done.\n');

  // Keep open indefinitely
  await page.waitForEvent('close').catch(() => {});
  await browser.close();
  console.log('👋 Browser closed.');
})();
