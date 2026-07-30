import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  const pages = ['/', '/resume', '/contact'];

  // Scroll-reveal fades content in over 600ms with per-element delays. Scanning
  // mid-fade makes axe read half-faded colours and report contrast failures that
  // don't exist once the animation settles, so these scans run with reduced
  // motion: reveals resolve instantly and every colour is its final value.
  //
  // This must be `page.emulateMedia()`, not `test.use({ reducedMotion })` — this
  // Playwright build has no `reducedMotion` fixture, so the `test.use` form is
  // accepted by the types and then silently ignored at runtime.
  const reduceMotion = (page: import('@playwright/test').Page) =>
    page.emulateMedia({ reducedMotion: 'reduce' });

  for (const pagePath of pages) {
    test(`axe-core scan passes on ${pagePath}`, async ({ page }) => {
      await reduceMotion(page);
      await page.goto(pagePath);
      // Walk the page so every IntersectionObserver-driven reveal fires.
      await page.evaluate(async () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        for (let y = 0; y <= scrollHeight; y += viewportHeight / 2) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 50));
        }
        // Longest reveal is delay 800ms + a 600ms transition.
        await new Promise(r => setTimeout(r, 2000));
      });
      // Ensure all scroll-reveal elements are fully visible
      const unrevealed = await page.locator('.scroll-reveal.not-revealed').count();
      expect(unrevealed).toBe(0);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  // Sections layer text over decorative background images, which stops axe from
  // resolving a background colour — those nodes land in `incomplete` rather than
  // `violations`, so the scan above cannot see them. Card backgrounds are opaque
  // and sit above the overlay, so assert their contrast directly.
  test('text over decorative backgrounds meets WCAG AA contrast', async ({ page }) => {
    await reduceMotion(page);
    await page.goto('/resume');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const failures = await page.evaluate(() => {
      const srgb = (c: number) => {
        const n = c / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      };
      const parse = (value: string) => {
        const probe = document.createElement('div');
        probe.style.color = value;
        document.body.appendChild(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        const nums = resolved.match(/[\d.]+/g)?.map(Number) ?? [];
        return { rgb: nums.slice(0, 3), alpha: nums[3] ?? 1 };
      };
      const luminance = ([r, g, b]: number[]) =>
        0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);

      const bad: string[] = [];
      for (const card of document.querySelectorAll('.timeline-card')) {
        const bg = parse(getComputedStyle(card).backgroundColor).rgb;
        for (const el of card.querySelectorAll('h3, p, span')) {
          const text = el.textContent?.trim();
          if (!text) continue;
          const { rgb, alpha } = parse(getComputedStyle(el).color);
          // Flatten any alpha against the opaque card background.
          const fg = rgb.map((c, i) => c * alpha + bg[i] * (1 - alpha));
          const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
          const ratio = (hi + 0.05) / (lo + 0.05);
          if (ratio < 4.5) bad.push(`${ratio.toFixed(2)}:1 — "${text.slice(0, 40)}"`);
        }
      }
      return bad;
    });

    expect(failures).toEqual([]);
  });

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
