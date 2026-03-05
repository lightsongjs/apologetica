import { test, expect } from '@playwright/test';

test('manual debugging - watch console and click around', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  // Listen to page errors
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  // Check if elements exist
  console.log('\n=== CHECKING IF ELEMENTS EXIST ===');
  const bottomNavBtn = await page.locator('#bottom-nav-search-btn').count();
  const floatingBtn = await page.locator('#floating-search-btn').count();
  const modal = await page.locator('#search-modal').count();

  console.log('Bottom nav search button count:', bottomNavBtn);
  console.log('Floating search button count:', floatingBtn);
  console.log('Search modal count:', modal);

  // Check if script is loaded
  const hasEventListener = await page.evaluate(() => {
    const btn = document.getElementById('bottom-nav-search-btn');
    // Can't directly check event listeners, but we can test if clicking works
    return btn !== null;
  });

  console.log('Bottom nav button exists in DOM:', hasEventListener);

  // Open browser console and pause
  console.log('\n=== BROWSER OPENED - Now click "Căutare" button manually ===');
  console.log('Check browser console (F12) for any errors');
  console.log('Try clicking both the bottom nav button and floating button');
  console.log('\nTest will wait for 60 seconds...\n');

  // Wait for user to interact
  await page.waitForTimeout(60000);
});
