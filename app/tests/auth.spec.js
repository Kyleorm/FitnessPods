// @ts-check
const { test, expect } = require('@playwright/test');

const TEST_EMAIL    = process.env.TEST_EMAIL    || '';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '';

const APP_TIMEOUT = 10000;

test.describe('Auth — Signup', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Get Started').click();
    await expect(page).toHaveURL(/\/signup/);
  });

  // ── HAPPY PATH ───────────────────────────────────────────

  test('signup page loads with all fields', async ({ page }) => {
    await expect(page.locator('input[autocomplete="name"]')).toBeVisible();
    await expect(page.locator('input[autocomplete="email"]')).toBeVisible();
    await expect(page.locator('input[autocomplete="tel"]')).toBeVisible();
    await expect(page.locator('input[autocomplete="new-password"]')).toBeVisible();
  });

  test('successful signup shows pending approval screen', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD env vars');
    await page.fill('input[autocomplete="name"]', 'Test User');
    await page.fill('input[autocomplete="email"]', TEST_EMAIL);
    await page.fill('input[autocomplete="tel"]', '+447700000000');
    await page.fill('input[autocomplete="new-password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=the list')).toBeVisible({ timeout: APP_TIMEOUT });
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('signup with single name shows error', async ({ page }) => {
    await page.fill('input[autocomplete="name"]', 'John');
    await page.fill('input[autocomplete="email"]', 'john@example.com');
    await page.fill('input[autocomplete="tel"]', '+447700000000');
    await page.fill('input[autocomplete="new-password"]', 'password123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=full name')).toBeVisible();
  });

  test('signup with short password shows error', async ({ page }) => {
    await page.fill('input[autocomplete="name"]', 'John Smith');
    await page.fill('input[autocomplete="email"]', 'john@example.com');
    await page.fill('input[autocomplete="tel"]', '+447700000000');
    await page.fill('input[autocomplete="new-password"]', 'short');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=8 characters')).toBeVisible();
  });

  test('back button returns to welcome screen', async ({ page }) => {
    await page.locator('button').first().click();
    await expect(page).toHaveURL(/\/welcome/);
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('signup form is usable on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await expect(page.locator('input[autocomplete="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

});

test.describe('Auth — Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // ── HAPPY PATH ───────────────────────────────────────────

  test('login page loads with email and password fields', async ({ page }) => {
    await expect(page.locator('input[autocomplete="email"]')).toBeVisible();
    await expect(page.locator('input[autocomplete="current-password"]')).toBeVisible();
  });

  test('valid credentials log user in', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD env vars');
    await page.fill('input[autocomplete="email"]', TEST_EMAIL);
    await page.fill('input[autocomplete="current-password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/home|\/pending/, { timeout: APP_TIMEOUT });
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('wrong password shows error message', async ({ page }) => {
    await page.fill('input[autocomplete="email"]', 'test@example.com');
    await page.fill('input[autocomplete="current-password"]', 'wrongpassword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: APP_TIMEOUT });
  });

  test('does not reveal whether email exists', async ({ page }) => {
    await page.fill('input[autocomplete="email"]', 'doesnotexist@example.com');
    await page.fill('input[autocomplete="current-password"]', 'anypassword');
    await page.locator('button[type="submit"]').click();
    const error = page.locator('text=Invalid email or password');
    await expect(error).toBeVisible({ timeout: APP_TIMEOUT });
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('login form is usable on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await expect(page.locator('input[autocomplete="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

});

test.describe('Auth — Pending approval screen', () => {

  test('pending screen shows correct message', async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD env vars');
    await page.goto('/login');
    await page.fill('input[autocomplete="email"]', TEST_EMAIL);
    await page.fill('input[autocomplete="current-password"]', TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/home|\/pending/, { timeout: APP_TIMEOUT });
    if (page.url().includes('/pending')) {
      await expect(page.locator('text=pending')).toBeVisible();
      await expect(page.locator('text=approval')).toBeVisible();
    }
  });

});
