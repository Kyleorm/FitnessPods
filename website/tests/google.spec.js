// @ts-check
const { test, expect } = require('@playwright/test');

// What Google (and phones) read from the site: the site icon, the real
// address of each page, the site name, robots.txt and the sitemap.

const PAGES = {
  '/': 'https://www.fitnesspod.im/',
  '/pods.html': 'https://www.fitnesspod.im/pods.html',
  '/privacy.html': 'https://www.fitnesspod.im/privacy.html',
  '/terms.html': 'https://www.fitnesspod.im/terms.html',
};

test.describe('Site icon', () => {

  for (const [path, canonical] of Object.entries(PAGES)) {
    test(`${path} links the site icon and its real fitnesspod.im address`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
      await expect(page.locator('link[rel="icon"][href="/icon-192.png"]')).toHaveCount(1);
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    });
  }

  test('every icon file is served as an image', async ({ request }) => {
    const files = { '/favicon.ico': 'image/x-icon', '/icon-192.png': 'image/png', '/apple-touch-icon.png': 'image/png' };
    for (const [file, type] of Object.entries(files)) {
      const res = await request.get(file);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain(type);
      expect((await res.body()).length).toBeGreaterThan(1000);
    }
  });

});

test.describe('Search and sharing details', () => {

  test('homepage tells Google the site name', async ({ page }) => {
    await page.goto('/');
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(json || '{}');
    expect(data['@type']).toBe('WebSite');
    expect(data.name).toBe('FitnessPod');
    expect(data.url).toBe('https://www.fitnesspod.im/');
  });

  test('homepage and pods page have link-preview details for WhatsApp and Facebook', async ({ page }) => {
    for (const path of ['/', '/pods.html']) {
      await page.goto(path);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /FitnessPod/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.fitnesspod.im/hero.jpg');
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', PAGES[path]);
    }
  });

  test('robots.txt lets Google in and points to the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('Allow: /');
    expect(text).not.toMatch(/Disallow:\s*\/\s*$/m);
    expect(text).toContain('Sitemap: https://www.fitnesspod.im/sitemap.xml');
  });

  test('sitemap lists every page', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const url of Object.values(PAGES)) expect(xml).toContain(`<loc>${url}</loc>`);
  });

});
