import { test, expect } from '@playwright/test';

test('Monitor manual navigation and trace all events', async ({ page }) => {
  console.log('\n=== NAVIGATION MONITOR STARTED ===\n');

  // Track all navigations
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      console.log(`[NAVIGATION] → ${frame.url()}`);
    }
  });

  // Track history API calls
  await page.addInitScript(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('[HISTORY.PUSHSTATE]', args[2] || args[0]);
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('[HISTORY.REPLACESTATE]', args[2] || args[0]);
      return originalReplaceState.apply(this, args);
    };

    // Track back/forward navigation
    window.addEventListener('popstate', (event) => {
      console.log('[POPSTATE] Back/forward navigation detected. Current URL:', location.href);
    });
  });

  // Track browser console logs
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[Search Debug]') || text.includes('[HISTORY') || text.includes('[POPSTATE]') || text.includes('[NAVIGATION]')) {
      console.log(`[BROWSER CONSOLE] ${text}`);
    }
  });

  // Track clicks on search buttons and links
  await page.exposeFunction('logClick', (element: string) => {
    console.log(`[CLICK] User clicked: ${element}`);
  });

  await page.addInitScript(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      let elementDesc = target.tagName;

      if (target.id) elementDesc += `#${target.id}`;
      if (target.className) elementDesc += `.${target.className.split(' ').join('.')}`;

      const href = target.closest('a')?.getAttribute('href');
      if (href) elementDesc += ` [href="${href}"]`;

      (window as any).logClick(elementDesc);
    });
  });

  // Start monitoring
  console.log('[INITIAL] Opening homepage...\n');
  await page.goto('/', { waitUntil: 'networkidle' });

  console.log('[READY] Page loaded. You can now interact with the page.');
  console.log('[INSTRUCTIONS] Navigate around, use search, click back/forward buttons.');
  console.log('[INSTRUCTIONS] When done, close the browser window.\n');

  // Wait indefinitely for manual testing (30 minutes max)
  await page.pause();

  console.log('\n=== NAVIGATION MONITOR ENDED ===\n');
});
