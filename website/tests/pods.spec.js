// @ts-check
const { test, expect } = require('@playwright/test');

const CLUBSOLUTION_URL = 'https://fitnesspod.clubsolution.co.uk';
const CLUBSOLUTION_RE = /^https:\/\/fitnesspod\.clubsolution\.co\.uk\/?/;

// Opens a link that uses target="_blank" and returns the new tab once it has loaded.
async function openInNewTab(context, link) {
  const [tab] = await Promise.all([
    context.waitForEvent('page'),
    link.click(),
  ]);
  await tab.waitForLoadState();
  return tab;
}

test.describe('Pods page', () => {

  test.beforeEach(async ({ page, context }) => {
    await context.route(CLUBSOLUTION_RE, route =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>ClubSolution</title>' }));
    await page.goto('/pods.html');
  });

  test('shows all 6 pods', async ({ page }) => {
    await expect(page.locator('.pods-grid .pod-card')).toHaveCount(6);
  });

  test('every Book button goes straight to ClubSolution in a new tab', async ({ page }) => {
    const bookLinks = page.locator('a', { hasText: /book/i });
    const count = await bookLinks.count();
    // nav, 6 pod cards, CTA, footer
    expect(count).toBeGreaterThanOrEqual(9);
    for (let i = 0; i < count; i++) {
      const link = bookLinks.nth(i);
      await expect(link).toHaveAttribute('href', CLUBSOLUTION_URL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('no links point to the retired booking page', async ({ page }) => {
    await expect(page.locator('a[href*="booking.html"]')).toHaveCount(0);
  });

  test('journey: Book a Session opens ClubSolution', async ({ page, context }) => {
    const cta = page.locator('.pods-cta__btns a', { hasText: 'Book a Session' });
    await cta.scrollIntoViewIfNeeded();
    const tab = await openInNewTab(context, cta);
    expect(tab.url()).toMatch(CLUBSOLUTION_RE);
  });

  test('mobile: Book Now in the menu opens ClubSolution', async ({ page, context, isMobile }) => {
    if (!isMobile) test.skip();
    await page.locator('.nav__toggle').click();
    const bookNow = page.locator('#main-nav a', { hasText: 'Book Now' });
    await expect(bookNow).toBeVisible();
    const tab = await openInNewTab(context, bookNow);
    expect(tab.url()).toMatch(CLUBSOLUTION_RE);
  });

});
