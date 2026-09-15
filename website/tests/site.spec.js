// @ts-check
const { test, expect } = require('@playwright/test');

// Pages and endpoints retired from the public site. They must not be served.
// (On Vercel, /booking.html redirects to ClubSolution; the local server just 404s.)
const RETIRED = [
  '/booking.html',
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

});
