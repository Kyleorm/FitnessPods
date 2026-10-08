// @ts-check
const { test, expect } = require('@playwright/test');

// The local server mirrors the redirects in vercel.json, so these check the real rules.
// maxRedirects: 0 stops the test following them, so ClubSolution is never called.

const CLUBSOLUTION = 'https://fitnesspod.clubsolution.co.uk';

// Old fitnesspod.im addresses that Google (and people's bookmarks) still have.
const OLD_SITE = {
  '/index.php': '/',
  '/how-it-works.php': '/#how-it-works',
  '/frequently-asked-questions.php': '/#faq',
  '/contact-us.php': '/#contact',
  '/take-a-tour.php': '/pods.html',
  '/blog/index.php': '/',
  '/blog': '/',
};

// Old links to the safety sheet and equipment manuals.
const OLD_MANUALS = {
  '/perch/resources/important-safety-instructions-9.pdf': '/manuals/safety-instructions.pdf',
  '/perch/resources/important-safety-instructions-12.pdf': '/manuals/safety-instructions.pdf',
  '/perch/resources/treadmill-t60-full-8.pdf': '/manuals/treadmill-t60-full-8.pdf',
  '/perch/resources/concept-2-rower-full-1.pdf': '/manuals/concept-2-rower-full-1.pdf',
};

test.describe('Booking links', () => {

  test('/booking.html and /booking send people to ClubSolution', async ({ request }) => {
    for (const path of ['/booking.html', '/booking']) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status()).toBe(307);
      expect(res.headers()['location']).toBe(CLUBSOLUTION);
    }
  });

});

test.describe('Old fitnesspod.im addresses', () => {

  for (const [from, to] of Object.entries(OLD_SITE)) {
    test(`${from} moves permanently to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(res.headers()['location']).toBe(to);
    });
  }

  for (const [from, to] of Object.entries(OLD_MANUALS)) {
    test(`${from} moves to ${to} and the PDF opens`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(res.headers()['location']).toBe(to);
      const pdf = await request.get(to);
      expect(pdf.status()).toBe(200);
      expect(pdf.headers()['content-type']).toContain('application/pdf');
    });
  }

  test('old section links land on sections that exist on the homepage', async ({ page }) => {
    await page.goto('/');
    for (const id of ['how-it-works', 'faq', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('an old file that never existed still shows "not found"', async ({ request }) => {
    const res = await request.get('/perch/resources/no-such-file.pdf');
    expect(res.status()).toBe(404);
    const page = await request.get('/no-such-page.php');
    expect(page.status()).toBe(404);
  });

});
