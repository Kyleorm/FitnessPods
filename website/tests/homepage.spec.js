// @ts-check
const { test, expect } = require('@playwright/test');

// Customers book on ClubSolution — every Book button on the site goes straight there.
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

test.describe('Homepage', () => {

  test.beforeEach(async ({ page, context }) => {
    // Tests never touch real third parties: ClubSolution, the contact form service,
    // or the live availability feed. Individual tests override these where needed.
    await context.route(CLUBSOLUTION_RE, route =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>ClubSolution</title>' }));
    await context.route('https://api.web3forms.com/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }));
    await page.route('**/api/availability**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ booked: [] }) }));
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

  test('navigation links are present and Book Now goes to ClubSolution', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile nav is inside hamburger — open it first
      await page.locator('.nav__toggle').click();
    }
    await expect(page.locator('#main-nav a[href="#availability"]')).toBeVisible();
    await expect(page.locator('#main-nav a[href="#pricing"]')).toBeVisible();
    const bookNow = page.locator('#main-nav a', { hasText: 'Book Now' });
    await expect(bookNow).toBeVisible();
    await expect(bookNow).toHaveAttribute('href', CLUBSOLUTION_URL);
  });

  test('pod availability section shows 6 pod cards', async ({ page }) => {
    await page.locator('#availability').scrollIntoViewIfNeeded();
    await expect(page.locator('.pod-card')).toHaveCount(6);
  });

  test('pricing section shows two rate cards', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('.payg-card')).toHaveCount(2);
    await expect(page.locator('.payg-card').first()).toContainText('£7');
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

  test('every Book button goes straight to ClubSolution in a new tab', async ({ page }) => {
    const bookLinks = page.locator('a', { hasText: /book/i });
    const count = await bookLinks.count();
    // nav, hero, 6 pod cards, 2 pricing cards, how it works, final CTA, footer
    expect(count).toBeGreaterThanOrEqual(13);
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

  test('journey: hero Book a Session opens ClubSolution', async ({ page, context }) => {
    const tab = await openInNewTab(context, page.locator('.hero__ctas a', { hasText: 'Book a Session' }));
    expect(tab.url()).toMatch(CLUBSOLUTION_RE);
  });

  test('journey: pod card Book button opens ClubSolution', async ({ page, context }) => {
    const podButton = page.locator('.pods-grid .pod-card').first().locator('.pod-card__footer a');
    await podButton.scrollIntoViewIfNeeded();
    const tab = await openInNewTab(context, podButton);
    expect(tab.url()).toMatch(CLUBSOLUTION_RE);
  });

  test('live pod status shows a booked pod as In Use', async ({ page }) => {
    const hour = new Date().getHours();
    await page.route('**/api/availability**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ booked: [{ pod: 'GymPod 1', hour }] }) }));
    await page.goto('/');
    const firstCard = page.locator('.pods-grid .pod-card').first();
    await expect(firstCard.locator('.pod-card__status')).toContainText('In Use');
    await expect(firstCard.locator('.pod-card__footer a')).toHaveText('Book Later');
    await expect(firstCard.locator('.pod-card__footer a')).toHaveAttribute('href', CLUBSOLUTION_URL);
  });

  test('contact form sends a valid message and confirms', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-message', 'Hello there');
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('#contact-form-msg')).toContainText('Message sent');
  });

  // ── UNHAPPY PATH ─────────────────────────────────────────

  test('Book buttons still work when the live availability feed is down', async ({ page }) => {
    await page.route('**/api/availability**', route => route.fulfill({ status: 500, body: 'error' }));
    await page.goto('/');
    const buttons = page.locator('.pods-grid .pod-card__footer a');
    await expect(buttons).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('href', CLUBSOLUTION_URL);
    }
  });

  test('contact form shows error when submitted empty and sends nothing', async ({ page }) => {
    let sent = 0;
    await page.route('https://api.web3forms.com/**', route => {
      sent++;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact-form button[type="submit"]').click();
    const msg = page.locator('#contact-form-msg');
    await expect(msg).toBeVisible();
    await expect(msg).toContainText('Please fill in');
    await page.waitForTimeout(500); // give any stray request time to show up
    expect(sent).toBe(0);
  });

  test('contact form shows error for invalid email and sends nothing', async ({ page }) => {
    let sent = 0;
    await page.route('https://api.web3forms.com/**', route => {
      sent++;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'notanemail');
    await page.fill('#contact-message', 'Hello there');
    await page.locator('#contact-form button[type="submit"]').click();
    const msg = page.locator('#contact-form-msg');
    await expect(msg).toBeVisible();
    await expect(msg).toContainText('valid email');
    await page.waitForTimeout(500);
    expect(sent).toBe(0);
  });

  test('contact form shows a friendly error if sending fails', async ({ page }) => {
    await page.route('https://api.web3forms.com/**', route =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false }) }));
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-message', 'Hello there');
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('#contact-form-msg')).toContainText('Something went wrong');
  });

  // ── MOBILE ───────────────────────────────────────────────

  test('mobile menu toggle opens nav', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.locator('.nav__toggle').click();
    await expect(page.locator('#main-nav')).toHaveClass(/open/);
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
