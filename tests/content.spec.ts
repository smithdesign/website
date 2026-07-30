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
    await expect(page.getByText('I turn legacy platforms into modern engineering organizations', { exact: false })).toBeVisible();
    await expect(page.getByText('Zappos.com').first()).toBeVisible();
  });

  test('displays key achievement metrics', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Faster Page Loads')).toBeVisible();
    await expect(page.getByText('Largest Contentful Paint Improvement')).toBeVisible();
    await expect(page.getByText('Faster Feature Development')).toBeVisible();
    await expect(page.getByText('Engineer Onboarding')).toBeVisible();
  });
});

test.describe('Resume Page Content', () => {
  test('displays experience summary', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('24+ years building for the web')).toBeVisible();
    await expect(page.getByText('7+ years leading engineering teams')).toBeVisible();
  });

  test('displays all timeline entries', async ({ page }) => {
    await page.goto('/resume');
    const companies = [
      'Amazon/Zappos', 'Koddi', 'Criteo', 'HookLogic',
      'Centurion Medical Products', 'Jackson National Life',
      'IBM Global Business Services', 'Meijer',
      'Smith Design Services'
    ];
    for (const company of companies) {
      await expect(page.getByText(company).first()).toBeVisible();
    }
  });

  test('displays skills', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('Engineering Management', { exact: true })).toBeVisible();
    await expect(page.getByText('React / Next.js')).toBeVisible();
    await expect(page.getByText('TypeScript', { exact: true })).toBeVisible();
  });

  test('displays education', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.getByText('Davenport University', { exact: false })).toBeVisible();
    await expect(page.getByText('2004-2006', { exact: false })).toBeVisible();
  });

  test('resume PDF download is available', async ({ page, request }) => {
    await page.goto('/resume');
    const link = page.locator('a[href="/resume.pdf"]');
    await expect(link).toBeVisible();
    const response = await request.get('/resume.pdf');
    expect(response.status()).toBe(200);
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
    await expect(page.getByText('tobbydigital@gmail.com')).toBeVisible();
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
