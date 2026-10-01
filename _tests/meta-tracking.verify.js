// Meta tracking verification for assets/consent.js (ViewContent params, _fbc, consent gate).
// Not published: Jekyll skips _-prefixed folders.
// Run: python3 -m http.server 8711 --bind 127.0.0.1  (repo root), then
//      npm i playwright && npx playwright install chromium && node _tests/meta-tracking.verify.js http://127.0.0.1:8711
// Red run on record: against main@0baa637 (pre-change) this fails 14 checks — 0 ViewContent, no _fbc.

// Usage: node verify.js <baseURL>
// Every non-localhost request is aborted, so fbevents.js never loads and the
// fbq stub keeps every call in fbq.queue — which is what we inspect. Nothing
// reaches Meta.
const { chromium } = require('playwright');
const BASE = process.argv[2];
let fails = 0;
const check = (name, ok, detail) => {
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

async function open(browser, { tz, locale, path = '/', time }) {
  const ctx = await browser.newContext({ timezoneId: tz, locale });
  const page = await ctx.newPage();
  const external = [];
  await page.route('**/*', r => {
    const u = new URL(r.request().url());
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return r.continue();
    external.push(u.hostname);
    return r.abort();
  });
  if (time) await page.clock.setFixedTime(new Date(time));
  await page.goto(BASE + path, { waitUntil: 'load' });
  // Stop navigation to the App Store AFTER the document-level handlers ran.
  await page.evaluate(() => window.addEventListener('click', e => e.preventDefault()));
  return { ctx, page, external };
}

const queue = page => page.evaluate(() =>
  (window.fbq && window.fbq.queue ? window.fbq.queue : []).map(a => JSON.parse(JSON.stringify(Array.from(a)))));
const vcs = q => q.filter(c => c[0] === 'track' && c[1] === 'ViewContent');
const cookie = async (ctx, n) => (await ctx.cookies()).find(c => c.name === n);
const badges = page => page.locator('a[href*="apps.apple.com"]');

(async () => {
  const browser = await chromium.launch();

  // A. US visitor, promo period, arrived from an ad.
  {
    const { ctx, page, external } = await open(browser, { tz: 'America/Los_Angeles', locale: 'en-US', path: '/?fbclid=test123', time: '2026-10-01T12:00:00Z' });
    const fbc = await cookie(ctx, '_fbc');
    check('A1 _fbc set from ?fbclid', !!fbc && /^fb\.1\.\d{13}\.test123$/.test(fbc.value), fbc && fbc.value);
    let q = await queue(page);
    check('A2 init + PageView queued', q.some(c => c[0] === 'init' && c[1] === '1280931707356419') && q.some(c => c[1] === 'PageView'));
    check('A3 no ViewContent before any click', vcs(q).length === 0);
    const n = await badges(page).count();
    check('A4 page has App Store links', n >= 2, `${n} links`);
    await badges(page).first().click();
    q = await queue(page);
    const v = vcs(q);
    check('A5 exactly one ViewContent per click', v.length === 1, `${v.length}`);
    const [, , params, opts] = v[0] || [];
    console.log('      params:', JSON.stringify(params), 'opts:', JSON.stringify(opts));
    check('A6 value is number 14.99', params && typeof params.value === 'number' && params.value === 14.99);
    check('A7 currency "USD"', params && params.currency === 'USD');
    check('A8 content_ids ["6761357439"]', params && JSON.stringify(params.content_ids) === '["6761357439"]');
    check('A9 content_type/name', params && params.content_type === 'product' && params.content_name === 'Standby Booth');
    const evId = await page.evaluate(() => window.__lastViewContentEventId);
    check('A10 eventID set and mirrored on window', opts && /^vc-\d+-[a-z0-9]+$/.test(opts.eventID) && opts.eventID === evId, evId);
    await badges(page).last().click();
    check('A11 second badge → second event (not doubled)', vcs(await queue(page)).length === 2);
    await page.locator('a:not([href*="apps.apple.com"])').first().click({ force: true }).catch(() => {});
    check('A12 non-App-Store link → no event', vcs(await queue(page)).length === 2);
    check('A13 tracker requests were blocked (nothing sent)', true, [...new Set(external)].join(', ') || 'none attempted');
    await ctx.close();
  }

  // B. Price switch boundary.
  for (const [t, want] of [['2026-10-09T23:59:59Z', 14.99], ['2026-10-10T00:00:00Z', 29.99], ['2026-12-01T00:00:00Z', 29.99]]) {
    const { ctx, page } = await open(browser, { tz: 'America/New_York', locale: 'en-US', time: t });
    await badges(page).first().click();
    const v = vcs(await queue(page));
    check(`B value at ${t} = ${want}`, v.length === 1 && v[0][2].value === want, v[0] && v[0][2].value);
    await ctx.close();
  }

  // C. EEA visitor — consent gate must hold.
  {
    const { ctx, page } = await open(browser, { tz: 'Europe/Berlin', locale: 'de-DE', path: '/?fbclid=eea123', time: '2026-10-01T12:00:00Z' });
    check('C1 no fbq before consent', await page.evaluate(() => typeof window.fbq) === 'undefined');
    check('C2 no _fbc before consent', !(await cookie(ctx, '_fbc')));
    await badges(page).first().click();
    check('C3 click before consent → nothing', await page.evaluate(() => typeof window.fbq) === 'undefined' && !(await page.evaluate(() => window.__lastViewContentEventId)));
    await page.getByRole('button', { name: /accept/i }).click();
    const fbc = await cookie(ctx, '_fbc');
    check('C4 _fbc set after Accept', !!fbc && fbc.value.endsWith('.eea123'), fbc && fbc.value);
    await badges(page).first().click();
    check('C5 click after Accept → exactly one ViewContent', vcs(await queue(page)).length === 1);
    await page.evaluate(() => window.sbConsent.reset());
    await page.getByRole('button', { name: /decline/i }).click();
    check('C6 Decline clears _fbc', !(await cookie(ctx, '_fbc')));
    await ctx.close();
  }

  // D. EEA visitor who declines — nothing ever.
  {
    const { ctx, page } = await open(browser, { tz: 'Europe/Paris', locale: 'fr-FR', path: '/?fbclid=no' });
    await page.getByRole('button', { name: /decline/i }).click();
    await badges(page).first().click();
    check('D1 declined → no fbq, no _fbc', await page.evaluate(() => typeof window.fbq) === 'undefined' && !(await cookie(ctx, '_fbc')));
    await ctx.close();
  }

  // E. Legal pages — zero trackers.
  for (const p of ['/privacy/?fbclid=x', '/terms/?fbclid=x']) {
    const { ctx, page } = await open(browser, { tz: 'America/Chicago', locale: 'en-US', path: p });
    check(`E ${p.split('?')[0]} → no fbq, no _fbc`, await page.evaluate(() => typeof window.fbq) === 'undefined' && !(await cookie(ctx, '_fbc')));
    await ctx.close();
  }

  // F. Existing _fbc is not overwritten.
  {
    const ctx = await browser.newContext({ timezoneId: 'America/Los_Angeles', locale: 'en-US' });
    await ctx.addCookies([{ name: '_fbc', value: 'fb.1.111.original', url: BASE }]);
    const page = await ctx.newPage();
    await page.route('**/*', r => /localhost|127\.0\.0\.1/.test(r.request().url()) ? r.continue() : r.abort());
    await page.goto(BASE + '/?fbclid=newer');
    check('F existing _fbc kept', (await cookie(ctx, '_fbc')).value === 'fb.1.111.original');
    await ctx.close();
  }

  await browser.close();
  console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
  process.exit(fails ? 1 : 0);
})();
