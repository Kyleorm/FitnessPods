// @ts-check
const { test, expect } = require('@playwright/test');

// Admin credentials from environment variables — never hardcode these
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const SUPABASE_TIMEOUT = 12000;

async function loginAsAdmin(page) {
  await page.goto('/admin.html');
  await page.fill('#admin-email', ADMIN_EMAIL);
  await page.fill('#admin-password', ADMIN_PASSWORD);
  await page.locator('#admin-login-btn').click();
  await expect(page.locator('#dashboard')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
}

test.describe('Admin dashboard', () => {

  test.beforeEach(async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set ADMIN_EMAIL and ADMIN_PASSWORD env vars to run admin tests');
    await loginAsAdmin(page);
  });

  // ── HAPPY PATH ───────────────────────────────────────────

  test('admin can log in and see dashboard', async ({ page }) => {
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('#customer-table')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

  test('customer list loads with at least one row', async ({ page }) => {
    await page.locator('[data-section="customers"]').click();
    const rows = page.locator('#customer-table tr').filter({ hasNotText: 'Loading' });
    await expect(rows.first()).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

  test('clicking a customer opens their modal', async ({ page }) => {
    await page.locator('[data-section="customers"]').click();
    const firstRow = page.locator('#customer-table tr').filter({ hasNotText: 'Loading' }).first();
    await firstRow.waitFor({ timeout: SUPABASE_TIMEOUT });
    await firstRow.click();
    await expect(page.locator('.modal')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

  test('customer modal shows approve or ban buttons', async ({ page }) => {
    await page.locator('[data-section="customers"]').click();
    const firstRow = page.locator('#customer-table tr').filter({ hasNotText: 'Loading' }).first();
    await firstRow.waitFor({ timeout: SUPABASE_TIMEOUT });
    await firstRow.click();
    await expect(page.locator('.modal')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    const hasApprove = await page.locator('.btn-modal-green').count();
    const hasBan     = await page.locator('.btn-modal-red').count();
    expect(hasApprove + hasBan).toBeGreaterThan(0);
  });

  test('dashboard stats section is visible', async ({ page }) => {
    await expect(page.locator('#stat-bookings-today')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    await expect(page.locator('#stat-pods-occupied')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    await expect(page.locator('#stat-total-customers')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

  test('search filters customer list', async ({ page }) => {
    await page.locator('[data-section="customers"]').click();
    await page.locator('#customer-table tr').filter({ hasNotText: 'Loading' }).first().waitFor({ timeout: SUPABASE_TIMEOUT });
    await page.fill('#customer-search', 'zzz_no_match_xyz');
    await page.waitForTimeout(500);
    const rows = page.locator('#customer-table tr').filter({ hasNotText: 'Loading' });
    const count = await rows.count();
    expect(count).toBe(0);
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('wrong password shows error message', async ({ page }) => {
    await page.goto('/admin.html');
    await page.fill('#admin-email', ADMIN_EMAIL);
    await page.fill('#admin-password', 'wrongpassword123');
    await page.locator('#admin-login-btn').click();
    await expect(page.locator('#login-error')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

  test('empty login form shows validation error', async ({ page }) => {
    await page.goto('/admin.html');
    await page.locator('#admin-login-btn').click();
    const error = page.locator('#login-error');
    await expect(error).toBeVisible();
  });

  test('non-admin account is rejected', async ({ page }) => {
    await page.goto('/admin.html');
    await page.fill('#admin-email', 'notanadmin@example.com');
    await page.fill('#admin-password', 'password123');
    await page.locator('#admin-login-btn').click();
    await expect(page.locator('#login-error')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    await expect(page.locator('#dashboard')).not.toBeVisible();
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('dashboard is usable on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('#customer-table')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
  });

});
