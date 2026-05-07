import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all nav links route to correct pages', async ({ page }) => {
    await page.goto('/');
    // Click Resume link, verify URL
    await page.click('nav a[href="/resume"]');
    await expect(page).toHaveURL('/resume');
    // Click Contact link, verify URL
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    // Click Introduction link, verify URL
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('mobile hamburger menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Hamburger button should be visible
    const toggle = page.locator('#mobile-menu-toggle');
    await expect(toggle).toBeVisible();
    // Menu should be hidden initially
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeHidden();
    // Click hamburger to open
    await toggle.click();
    await expect(menu).toBeVisible();
    // Click hamburger to close
    await toggle.click();
    await expect(menu).toBeHidden();
  });

  test('mobile menu links navigate correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('#mobile-menu-toggle');
    await page.click('#mobile-menu a[href="/resume"]');
    await expect(page).toHaveURL('/resume');
  });

  test('sticky navigation remains visible on scroll', async ({ page }) => {
    await page.goto('/resume');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(100);
    // Header should still be visible (sticky)
    await expect(header).toBeVisible();
    await expect(header).toBeInViewport();
  });
});
