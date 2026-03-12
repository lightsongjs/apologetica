import { test } from '@playwright/test';

test('screenshot tema Matei page', async ({ page }) => {
  await page.goto('/teme/evanghelia-matei');
  await page.waitForLoadState('networkidle');

  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  // Take visible viewport screenshot
  await page.screenshot({
    path: 'tests/screenshots/tema-matei-viewport.png',
  });

  // Take full page screenshot
  await page.screenshot({
    path: 'tests/screenshots/tema-matei-full.png',
    fullPage: true,
  });
});
