// @ts-check
const { test, expect } = require('@playwright/test');

// Pages and endpoints retired from the public site. They must not be served.
// (/booking.html redirects to ClubSolution instead — see redirects.spec.js.)
const RETIRED = [
  '/analytics.html',
  '/_snippets/_admin-dashboard.html',
  '/_backups/booking-supabase-version.html',
  '/finishing%20project/claude-code-context-prompt.txt',
  '/api/send-email',
];

test.describe('Retired pages and endpoints', () => {
  for (const path of RETIRED) {
    test(`${path} is not served`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(404);
    });
  }
});

test.describe('Live availability API', () => {

  test('returns booked pod hours for today with no personal data', async ({ request }) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const res = await request.get(`/api/availability?date=${today}`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.booked)).toBe(true);
    for (const booking of json.booked) {
      expect(Object.keys(booking).sort()).toEqual(['hour', 'pod']);
    }
  });

  test('rejects an invalid date', async ({ request }) => {
    const res = await request.get('/api/availability?date=notadate');
    expect(res.status()).toBe(400);
  });

  test('rejects a missing date', async ({ request }) => {
    const res = await request.get('/api/availability');
    expect(res.status()).toBe(400);
  });

  test('rejects dates other than yesterday, today or tomorrow', async ({ request }) => {
    for (const date of ['2020-01-01', '2099-12-31', '2026-02-30']) {
      const res = await request.get(`/api/availability?date=${date}`);
      expect(res.status()).toBe(400);
    }
  });

  test('rate limits a visitor who sends too many requests', async ({ request }, testInfo) => {
    // A made-up visitor IP, unique to this test run, so other tests aren't limited.
    // Invalid dates are used so ClubSolution is never called.
    const headers = { 'x-forwarded-for': `203.0.113.${testInfo.project.name === 'mobile' ? 2 : 1}` };
    for (let i = 0; i < 30; i++) {
      const res = await request.get('/api/availability?date=bad', { headers });
      expect(res.status()).toBe(400);
    }
    const blocked = await request.get('/api/availability?date=bad', { headers });
    expect(blocked.status()).toBe(429);
    expect(blocked.headers()['retry-after']).toBeTruthy();
  });

});

test.describe('Security headers', () => {

  test('every page sends the browser security headers', async ({ request }) => {
    for (const path of ['/', '/pods.html', '/privacy.html', '/terms.html']) {
      const headers = (await request.get(path)).headers();
      expect(headers['content-security-policy']).toContain("script-src 'self'");
      expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['permissions-policy']).toContain('camera=()');
    }
  });

  for (const path of ['/', '/pods.html', '/privacy.html', '/terms.html']) {
    test(`${path} works under the security policy with nothing blocked`, async ({ page }) => {
      // Collect anything the Content-Security-Policy blocks while the page runs.
      const violations = [];
      page.on('console', msg => {
        if (/Content Security Policy/i.test(msg.text())) violations.push(msg.text());
      });
      await page.route('**/api/availability**', route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ booked: [] }) }));
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Scroll to the bottom so every scroll-triggered script runs too.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      expect(violations).toEqual([]);
      // The page's own scripts ran: main.js marks the nav as scrolled.
      await expect(page.locator('#nav')).toHaveClass(/scrolled/);
    });
  }

  test('the Google map on the homepage is allowed to load', async ({ page }) => {
    // The map is a lazy-loaded Google iframe, so only scrolling it into view shows
    // whether the security policy blocks it. Google is stubbed so the test runs offline.
    const violations = [];
    page.on('console', msg => {
      if (/Content Security Policy/i.test(msg.text())) violations.push(msg.text());
    });
    let mapRequested = false;
    await page.route(/^https:\/\/(maps|www)\.google\.com\/maps/, route => {
      mapRequested = true;
      route.fulfill({ status: 200, contentType: 'text/html', body: '<p>map</p>' });
    });
    await page.route('**/api/availability**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ booked: [] }) }));
    await page.goto('/');
    await page.locator('.find-us-map iframe').scrollIntoViewIfNeeded();
    // Wait until the map either loads or is blocked.
    await expect.poll(() => mapRequested || violations.length > 0).toBe(true);
    expect(violations).toEqual([]);
    expect(mapRequested).toBe(true);
  });

});
