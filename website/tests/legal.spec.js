// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Legal pages', () => {

  test('Privacy Policy page loads', async ({ page }) => {
    await page.goto('/privacy.html');
    await expect(page).toHaveTitle(/Privacy Policy/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="mailto:hello@fitnesspod.im"]').first()).toBeVisible();
  });

  test('Terms of Use page loads', async ({ page }) => {
    await page.goto('/terms.html');
    await expect(page).toHaveTitle(/Terms of Use/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Privacy Policy has cookie section', async ({ page }) => {
    await page.goto('/privacy.html#cookies');
    await expect(page.locator('#cookies')).toBeVisible();
  });

  test('footer links on homepage point to real legal pages', async ({ page }) => {
    await page.goto('/');
    const privacyLink = page.locator('a[href="privacy.html"]').first();
    const termsLink   = page.locator('a[href="terms.html"]').first();
    await expect(privacyLink).toBeVisible();
    await expect(termsLink).toBeVisible();
  });

  test('back link on privacy page points to homepage', async ({ page }) => {
    await page.goto('/privacy.html');
    const backLink = page.locator('a.back-link');
    // Verify the href is correct — sticky nav prevents direct click, so we navigate via href
    const href = await backLink.getAttribute('href');
    expect(href).toMatch(/index\.html/);
    await page.goto('/' + href);
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

});
