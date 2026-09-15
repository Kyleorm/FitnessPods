// @ts-check
const { test, expect } = require('@playwright/test');

// Supabase RPC calls add latency — allow extra time for slot operations
const SUPABASE_TIMEOUT = 12000;

test.describe('Booking page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/booking.html');
    // Wait for the async grid to finish loading from Supabase before each test
    await page.waitForSelector('.sg-slot--free, .sg-slot--booked', { timeout: SUPABASE_TIMEOUT });
  });

  // ── HAPPY PATH ───────────────────────────────────────────

  test('loads with correct title and stepper', async ({ page }) => {
    await expect(page).toHaveTitle(/Book a Pod/);
    await expect(page.locator('.stepper')).toBeVisible();
    await expect(page.locator('.step--active')).toContainText('1');
  });

  test('day picker shows 7 day buttons', async ({ page }) => {
    const days = page.locator('.day-btn');
    await expect(days).toHaveCount(7);
    await expect(days.first()).toContainText('Today');
  });

  test('schedule grid renders 6 pod columns', async ({ page }) => {
    const headers = page.locator('.schedule-table thead th').filter({ hasNotText: 'Time' });
    await expect(headers).toHaveCount(6);
  });

  test('selecting a free slot locks it and shows booking bar', async ({ page }) => {
    const freeSlot = page.locator('.sg-slot--free').first();
    await freeSlot.click();
    // Wait for the Supabase try_lock_slot RPC to complete and UI to update
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await expect(page.locator('#bar-price')).toContainText('£');
    await expect(page.locator('#lock-countdown')).toContainText('reserved', { timeout: SUPABASE_TIMEOUT });
  });

  test('selecting a slot and continuing reaches details step', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await expect(page.locator('#view-step2')).toBeVisible();
    await expect(page.locator('.step--active')).toContainText('2');
  });

  test('completing details form reaches payment step', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Smith');
    await page.fill('#email', 'john@example.com');
    await page.fill('#phone', '+447700000000');
    await page.locator('#btn-next-2').click();
    await expect(page.locator('#view-step3')).toBeVisible();
    await expect(page.locator('.step--active')).toContainText('3');
  });

  test('order summary on payment step shows booking details', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Smith');
    await page.fill('#email', 'john@example.com');
    await page.fill('#phone', '+447700000000');
    await page.locator('#btn-next-2').click();
    await expect(page.locator('#os-pod')).not.toContainText('—');
    await expect(page.locator('#os-total')).toContainText('£');
  });

  test('completing payment reaches confirmation step without fake door code', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'User');
    await page.fill('#email', 'test@fitnesspod.im');
    await page.fill('#phone', '+447700000000');
    await page.locator('#btn-next-2').click();
    await page.locator('#pay-btn').click();
    // Wait for confirm_booking RPC — allow extra time
    await expect(page.locator('#view-step4')).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    // Door code must NOT be a raw number — must say "sent to email/phone"
    const codeEl = page.locator('#door-code');
    await expect(codeEl).toBeVisible();
    await expect(codeEl).not.toHaveText(/^\d{4}$/);
    await expect(codeEl).toContainText(/sent|email|phone/i);
  });

  test('switching days rebuilds the schedule grid', async ({ page }) => {
    const secondDay = page.locator('.day-btn').nth(1);
    await secondDay.click();
    // Wait for the async rebuild to complete
    await page.waitForSelector('.sg-slot--free, .sg-slot--booked', { timeout: SUPABASE_TIMEOUT });
    await expect(secondDay).toHaveClass(/active/);
    await expect(page.locator('.schedule-table tbody tr')).toHaveCount(24);
  });

  test('back button on details step returns to step 1', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.locator('#btn-back-2').click();
    await expect(page.locator('#view-step1')).toBeVisible();
    await expect(page.locator('.step--active')).toContainText('1');
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('continuing without selecting a slot shows error banner', async ({ page }) => {
    await page.locator('#btn-continue').click();
    const banner = page.locator('#grid-error-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/select a time slot/i);
  });

  test('continuing with empty name shows inline error', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.locator('#btn-next-2').click();
    await expect(page.locator('.field-error')).toBeVisible();
  });

  test('continuing with invalid email shows inline error', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Smith');
    await page.fill('#email', 'notanemail');
    await page.fill('#phone', '+447700000000');
    await page.locator('#btn-next-2').click();
    await expect(page.locator('.field-error')).toBeVisible();
    await expect(page.locator('.field-error')).toContainText('valid email');
  });

  test('continuing with invalid phone shows inline error', async ({ page }) => {
    await page.locator('.sg-slot--free').first().click();
    await expect(page.locator('#booking-bar')).not.toHaveClass(/hidden/, { timeout: SUPABASE_TIMEOUT });
    await page.locator('#btn-continue').click();
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Smith');
    await page.fill('#email', 'john@example.com');
    await page.fill('#phone', 'abc');
    await page.locator('#btn-next-2').click();
    await expect(page.locator('.field-error')).toBeVisible();
  });

  test('booked slots cannot be selected', async ({ page }) => {
    const bookedSlot = page.locator('.sg-slot--booked').first();
    if (await bookedSlot.count() > 0) {
      await expect(bookedSlot).toBeDisabled();
    }
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('booking bar is full width on mobile', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.locator('.sg-slot--free').first().click();
    const bar = page.locator('#booking-bar');
    await expect(bar).toBeVisible({ timeout: SUPABASE_TIMEOUT });
    const box = await bar.boundingBox();
    const viewport = page.viewportSize();
    if (box && viewport) {
      expect(box.width).toBeGreaterThan(viewport.width * 0.8);
    }
  });

});
