import { test, expect } from '@playwright/test';

test.describe('Personality Images', () => {
  const personalities = [
    { slug: 'andrei-criteanul', name: 'Andrei Criteanul' },
    { slug: 'daniel', name: 'Daniel' },
    { slug: 'ieremia', name: 'Ieremia' },
    { slug: 'iezechiel', name: 'Iezechiel' },
    { slug: 'ignatie-teoforul', name: 'Ignatie Teoforul' },
    { slug: 'irineu', name: 'Irineu' },
    { slug: 'isaia', name: 'Isaia' },
    { slug: 'manase', name: 'Manase' },
    { slug: 'policarp', name: 'Policarp' }
  ];

  for (const personality of personalities) {
    test(`should load image for ${personality.name}`, async ({ page }) => {
      await page.goto(`/personalitati/${personality.slug}`);

      // Wait for the profile image to be visible
      const profileImage = page.locator('.bg-cover.rounded-full').first();
      await expect(profileImage).toBeVisible();

      // Get the background-image style
      const backgroundImage = await profileImage.getAttribute('style');
      console.log(`${personality.name} background-image: ${backgroundImage}`);

      // Check that there's a background image set
      expect(backgroundImage).toContain('background-image: url');

      // Extract URL from the style
      const urlMatch = backgroundImage?.match(/url\("(.+?)"\)/);
      if (urlMatch) {
        const imageUrl = urlMatch[1];
        console.log(`Testing image URL: ${imageUrl}`);

        // Test if the image URL is accessible
        const response = await page.request.get(imageUrl);
        console.log(`${personality.name} image status: ${response.status()}`);

        // Should return 200 OK
        expect(response.status()).toBe(200);

        // Should be an image (including SVG)
        const contentType = response.headers()['content-type'];
        console.log(`${personality.name} content-type: ${contentType}`);
        expect(contentType).toMatch(/image\/(jpeg|jpg|png|webp|svg\+xml)/);
      }
    });
  }
});
