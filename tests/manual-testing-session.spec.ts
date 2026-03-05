import { test, expect } from '@playwright/test';

test('Manual testing session - user controlled', async ({ page }) => {
  // Enable detailed logging
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error));
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log('NAVIGATED TO:', frame.url());
    }
  });

  // Start at homepage
  await page.goto('http://localhost:4321/');
  console.log('✓ Browser opened at homepage');
  console.log('═══════════════════════════════════════════');
  console.log('YOU CAN NOW INTERACT WITH THE BROWSER');
  console.log('Close the browser window when done testing');
  console.log('═══════════════════════════════════════════');

  // Keep the browser open - wait for manual close (1 hour timeout)
  await page.waitForTimeout(3600000);
});
