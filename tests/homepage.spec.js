// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── HAPPY PATH ───────────────────────────────────────────

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/FitnessPod IOM/);
  });

  test('hero section is visible with headline', async ({ page }) => {
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.hero__headline')).toContainText('Train');
  });

  test('navigation links are present', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile nav is inside hamburger — open it first
      await page.locator('.nav__toggle').click();
    }
    await expect(page.locator('a[href="#availability"]').first()).toBeVisible();
    await expect(page.locator('a[href="#pricing"]').first()).toBeVisible();
    await expect(page.locator('a[href="booking.html"]').first()).toBeVisible();
  });

  test('pod availability section shows 6 pod cards', async ({ page }) => {
    await page.locator('#availability').scrollIntoViewIfNeeded();
    const cards = page.locator('.pod-card');
    await expect(cards).toHaveCount(6);
  });

  test('pricing section shows two rate cards', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('.payg-card')).toHaveCount(2);
    await expect(page.locator('.payg-card').first()).toContainText('£6.50');
  });

  test('FAQ accordion opens and closes', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const firstBtn = page.locator('.faq__q').first();
    await firstBtn.click();
    await expect(page.locator('.faq__item').first()).toHaveClass(/open/);
    await firstBtn.click();
    await expect(page.locator('.faq__item').first()).not.toHaveClass(/open/);
  });

  test('contact form is present with required fields', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
  });

  test('footer contains links to Privacy Policy and Terms', async ({ page }) => {
    await expect(page.locator('a[href="privacy.html"]')).toBeVisible();
    await expect(page.locator('a[href="terms.html"]')).toBeVisible();
  });

  test('Book Now CTA links to booking page', async ({ page }) => {
    // Use the hero CTA button which is always visible (not inside the hamburger nav)
    const bookBtn = page.locator('.hero__ctas a[href="booking.html"]');
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();
    await expect(page).toHaveURL(/booking\.html/);
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('contact form shows error when submitted empty', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact-form button[type="submit"]').click();
    const msg = page.locator('#contact-form-msg');
    await expect(msg).toBeVisible();
    await expect(msg).toContainText('Please fill in');
  });

  test('contact form shows error for invalid email', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'notanemail');
    await page.fill('#contact-message', 'Hello there');
    await page.locator('#contact-form button[type="submit"]').click();
    const msg = page.locator('#contact-form-msg');
    await expect(msg).toBeVisible();
    await expect(msg).toContainText('valid email');
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('mobile menu toggle opens nav', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    const toggle = page.locator('.nav__toggle');
    await toggle.click();
    await expect(page.locator('#main-nav')).toHaveClass(/open/);
  });

});
