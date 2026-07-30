import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

// The hero orbs and scroll-reveals animate indefinitely, so a plain screenshot
// never sees two identical frames and eventually times out. Reduced motion
// settles the reveals, `animations: 'disabled'` freezes the orbs, and the
// remote hero images are stubbed so a slow network can't change the layout.
const shot = { fullPage: true, animations: 'disabled' as const };

async function ready(page: import('@playwright/test').Page, path: string) {
  // Reduced motion MUST be set here rather than via `test.use({ reducedMotion })`:
  // this Playwright build has no `reducedMotion` fixture, so the `test.use` form
  // is silently dropped and the page renders with animations live. That produced
  // screenshots where 8 of 9 timeline entries were still at opacity 0.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Replace the Unsplash background images with a fixed local pixel — the same
  // size and position, but no network dependency and no decode variance.
  await page.route('https://images.unsplash.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/gif',
      body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
    })
  );
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // Guard against the failure above silently returning: every reveal wrapper
  // must be fully opaque before the snapshot is taken.
  await expect(page.locator('.scroll-reveal.not-revealed')).toHaveCount(0);
}

test.describe('Responsive Layout', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      test('Introduction page screenshot', async ({ page }) => {
        await ready(page, '/');
        await expect(page).toHaveScreenshot(`intro-${viewport.name}.png`, shot);
      });

      test('Resume page screenshot', async ({ page }) => {
        await ready(page, '/resume');
        await expect(page).toHaveScreenshot(`resume-${viewport.name}.png`, shot);
      });

      test('Contact page screenshot', async ({ page }) => {
        await ready(page, '/contact');
        await expect(page).toHaveScreenshot(`contact-${viewport.name}.png`, shot);
      });
    });
  }

  test('timeline uses left-aligned layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/resume');
    // On mobile, the timeline line should be on the left
    const timelineLine = page.locator('.timeline > div').first();
    const box = await timelineLine.boundingBox();
    expect(box?.x).toBeLessThan(50); // Line should be near the left edge
  });

  test('timeline uses center-aligned layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/resume');
    // On desktop, the timeline line should be roughly centered
    const timelineLine = page.locator('.timeline > div').first();
    const box = await timelineLine.boundingBox();
    // Center of 1440px viewport with max-w-4xl (896px) container
    // Line should be somewhere around the middle
    if (box) {
      expect(box.x).toBeGreaterThan(200);
    }
  });

  test('hamburger menu is hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('#mobile-menu-toggle')).toBeHidden();
  });

  test('desktop nav links are hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Desktop nav links should be hidden
    const desktopNav = page.locator('header nav ul.hidden');
    await expect(desktopNav).toBeHidden();
    // Hamburger should be visible
    await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
  });
});
