// @ts-check
const { test, expect } = require('@playwright/test');

// "Designed by KDO Digital" credit in the footer of every page.
const PAGES = ['/', '/pods.html', '/privacy.html', '/terms.html'];
const KDO_URL = 'https://www.kdodigital.co.uk';

test.describe('Footer agency credit', () => {

  for (const path of PAGES) {
    test(`credit shows and links to KDO Digital on ${path}`, async ({ page }) => {
      await page.goto(path);
      const credit = page.locator('.footer__credit');
      await credit.scrollIntoViewIfNeeded();
      await expect(credit).toBeVisible();
      await expect(credit).toContainText(/Designed by\s+KDO Digital/i);

      const link = credit.locator('a', { hasText: 'KDO Digital' });
      await expect(link).toHaveAttribute('href', KDO_URL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    });
  }

  test('clicking the name opens KDO Digital in a new tab and keeps the gym site open', async ({ page, context }) => {
    // Stub the external site so the test does not depend on the internet
    await context.route(`${KDO_URL}/**`, route =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>KDO Digital</title>' })
    );

    await page.goto('/');
    const link = page.locator('.footer__credit a');
    await link.scrollIntoViewIfNeeded();

    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      link.click(),
    ]);
    await newTab.waitForLoadState();
    expect(newTab.url()).toMatch(/^https:\/\/www\.kdodigital\.co\.uk\/?$/);

    // The FitnessPod page must not have navigated away
    await expect(page).toHaveURL(/localhost:3000\/?$/);
  });

  test('credit link can be reached by keyboard and shows a focus ring', async ({ page }) => {
    await page.goto('/terms.html');
    const link = page.locator('.footer__credit a');
    await link.focus();
    await expect(link).toBeFocused();
    const outline = await link.evaluate(el => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('credit fits on a small phone without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/');
    const credit = page.locator('.footer__credit');
    await credit.scrollIntoViewIfNeeded();
    const box = await credit.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    // The footer itself must not be wider than the screen
    const footerOverflows = await page.locator('footer').evaluate(el => el.scrollWidth > el.clientWidth);
    expect(footerOverflows).toBe(false);
  });

});
