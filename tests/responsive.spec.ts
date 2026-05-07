import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Responsive Layout', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test('Introduction page screenshot', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveScreenshot(`intro-${viewport.name}.png`, { fullPage: true });
      });

      test('Resume page screenshot', async ({ page }) => {
        await page.goto('/resume');
        await expect(page).toHaveScreenshot(`resume-${viewport.name}.png`, { fullPage: true });
      });

      test('Contact page screenshot', async ({ page }) => {
        await page.goto('/contact');
        await expect(page).toHaveScreenshot(`contact-${viewport.name}.png`, { fullPage: true });
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
