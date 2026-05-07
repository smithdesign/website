import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  const pages = ['/', '/resume', '/contact'];

  for (const pagePath of pages) {
    test(`axe-core scan passes on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      // Scroll to bottom to trigger all scroll-reveal animations, then wait for them to complete
      await page.evaluate(async () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        // Scroll through the entire page to trigger IntersectionObserver
        for (let y = 0; y <= scrollHeight; y += viewportHeight / 2) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 50));
        }
        // Wait for all delayed animations to complete (max delay is ~1000ms + 600ms transition)
        await new Promise(r => setTimeout(r, 2000));
      });
      // Ensure all scroll-reveal elements are fully visible
      const unrevealed = await page.locator('.scroll-reveal.not-revealed').count();
      expect(unrevealed).toBe(0);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('keyboard tab order is logical on home page', async ({ page }) => {
    await page.goto('/');
    // First tab should focus skip-to-content link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    // Next tab should focus the site logo/name link in nav
    await page.keyboard.press('Tab');
    const logoLink = page.locator('nav a[href="/"]').first();
    await expect(logoLink).toBeFocused();
  });

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Check that the focused element has visible outline
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  for (const pagePath of pages) {
    test(`heading hierarchy is correct on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      // Get all headings
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);

      // Verify h1 exists
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Verify no skipped levels
      const levels: number[] = [];
      for (const heading of headings) {
        const tag = await heading.evaluate(el => el.tagName.toLowerCase());
        levels.push(parseInt(tag.replace('h', '')));
      }

      for (let i = 1; i < levels.length; i++) {
        const diff = levels[i] - levels[i - 1];
        // Can go down any amount, but can only go up by 1
        expect(diff).toBeLessThanOrEqual(1);
      }
    });
  }
});
