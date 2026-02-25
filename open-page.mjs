import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Opening browser for manual testing...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 400, height: 900 }
  });

  const page = await context.newPage();

  console.log('📱 Navigating to personality page...');
  await page.goto('http://localhost:4321/personalitati/ignatie-teoforul');
  await page.waitForLoadState('networkidle');

  console.log('\n✅ Page loaded! Browser will stay open for manual testing.');
  console.log('📜 Scroll down to test sticky headers on:');
  console.log('   - Surse și scrieri (7+ items)');
  console.log('   - Contemporani (4+ items)');
  console.log('   - Citate din scrierile sale (4+ items)');
  console.log('   - Semnificație (6+ items)');
  console.log('\n💡 Close the browser window when done testing.\n');

  // Keep browser open until user closes it
  await page.waitForEvent('close').catch(() => {});
  await browser.close();
  console.log('👋 Browser closed. Test session ended.');
})();
