import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 400, height: 800 }
  });
  const page = await context.newPage();

  console.log('📱 Opening personality page...');
  await page.goto('http://localhost:4321/personalitati/ignatie-teoforul');
  await page.waitForLoadState('networkidle');

  // Take initial screenshot
  console.log('📸 Screenshot 1: Page loaded');
  await page.screenshot({ path: 'test-1-initial.png', fullPage: false });

  // Scroll to Sources section
  console.log('📜 Scrolling to Sources section...');
  await page.locator('text=Surse și scrieri').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  console.log('📸 Screenshot 2: At Sources section');
  await page.screenshot({ path: 'test-2-sources.png', fullPage: false });

  // Scroll down within sources to see sticky header
  console.log('⬇️ Scrolling down to test sticky header...');
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);
  console.log('📸 Screenshot 3: Sources header should be sticky');
  await page.screenshot({ path: 'test-3-sticky-sources.png', fullPage: false });

  // Scroll to Contemporaries
  console.log('👥 Scrolling to Contemporaries section...');
  await page.locator('text=Contemporani').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  console.log('📸 Screenshot 4: At Contemporaries section');
  await page.screenshot({ path: 'test-4-contemporaries.png', fullPage: false });

  // Scroll down within contemporaries
  console.log('⬇️ Scrolling down to test sticky header...');
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);
  console.log('📸 Screenshot 5: Contemporaries header should be sticky');
  await page.screenshot({ path: 'test-5-sticky-contemporaries.png', fullPage: false });

  // Check if headers have sticky class
  console.log('\n✅ Verifying sticky headers...');
  const stickyHeaders = await page.locator('.sticky').count();
  console.log(`Found ${stickyHeaders} sticky headers`);

  // Verify specific sections exist
  const sections = ['Biografie', 'Cronologie', 'Surse și scrieri', 'Contemporani', 'Citate din scrierile sale', 'Semnificație'];
  for (const section of sections) {
    const exists = await page.locator(`text=${section}`).count() > 0;
    console.log(`${exists ? '✅' : '❌'} Section: ${section}`);
  }

  console.log('\n📸 All screenshots saved!');
  console.log('   - test-1-initial.png');
  console.log('   - test-2-sources.png');
  console.log('   - test-3-sticky-sources.png');
  console.log('   - test-4-contemporaries.png');
  console.log('   - test-5-sticky-contemporaries.png');

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\n✅ Test complete!');
})();
