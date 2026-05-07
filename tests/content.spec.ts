import { test, expect } from '@playwright/test';

test.describe('Introduction Page Content', () => {
  test('displays name, title, and tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Tobby Smith');
    await expect(page.getByText('Software Development Leader')).toBeVisible();
    await expect(page.getByText('24+ years')).toBeVisible();
  });

  test('displays professional summary', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('seasoned engineering leader')).toBeVisible();
    await expect(page.getByText('Zappos.com')).toBeVisible();
  });

  test('displays four competency areas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Engineering Team Leadership')).toBeVisible();
    await expect(page.getByText('Platform Architecture & Modernization')).toBeVisible();
    await expect(page.getByText('Stakeholder & Roadmap Management')).toBeVisible();
    await expect(page.getByText('Performance Optimization at Scale')).toBeVisible();
  });
});

test.describe('Resume Page Content', () => {
  test('displays professional summary', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('24 years')).toBeVisible();
    await expect(page.getByText('7+ years')).toBeVisible();
  });

  test('displays all 11 timeline entries', async ({ page }) => {
    await page.goto('/resume');
    const companies = [
      'Amazon/Zappos', 'Koddi', 'Criteo', 'HookLogic',
      'Centurion Medical Products', 'Jackson National Life',
      'IBM Global Business Services', 'gNetworks', 'Meijer',
      'Smith Design Services'
    ];
    for (const company of companies) {
      await expect(page.getByText(company).first()).toBeVisible();
    }
  });

  test('displays skills', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('Engineering Management', { exact: true })).toBeVisible();
    await expect(page.getByText('React/Next.js')).toBeVisible();
    await expect(page.getByText('JavaScript/TypeScript')).toBeVisible();
  });

  test('displays education and award', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('Davenport University')).toBeVisible();
    await expect(page.getByText('2004-2006')).toBeVisible();
    await expect(page.getByText('Web Developer of the Month')).toBeVisible();
  });
});

test.describe('Contact Page Content', () => {
  test('displays social links', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('LinkedIn').first()).toBeVisible();
    await expect(page.getByText('GitHub').first()).toBeVisible();
    await expect(page.getByText('Twitter').first()).toBeVisible();
    await expect(page.getByText('Facebook').first()).toBeVisible();
  });

  test('displays email', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('tobby@tobbysmith.com')).toBeVisible();
  });

  test('displays location', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('Las Vegas Metropolitan Area')).toBeVisible();
  });

  test('does not have a contact form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('form')).toHaveCount(0);
  });
});
