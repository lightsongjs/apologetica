import { test } from '@playwright/test';

test('debug Irineu page', async ({ page }) => {
  await page.goto('http://localhost:4323/personalitati/irineu');

  // Take screenshot
  await page.screenshot({ path: 'test-results/irineu-page.png', fullPage: true });

  // Get all h2 headings
  const h2Elements = await page.locator('h2').all();
  console.log('Number of h2 elements:', h2Elements.length);
  for (const h2 of h2Elements) {
    console.log('h2 text:', await h2.textContent());
  }

  // Check for any errors or warnings in console
  page.on('console', msg => console.log('Browser console:', msg.text()));

  // Get all sections
  const sections = await page.locator('section').all();
  console.log('Number of sections:', sections.length);

  // Check if there are any empty sections
  for (let i = 0; i < sections.length; i++) {
    const text = await sections[i].textContent();
    console.log(`Section ${i} length:`, text?.length);
  }
});
