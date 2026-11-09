// AEO handoff regression checks. Run with a local HTTP server and Playwright.
// Every external request is blocked. Screenshots go to AEO_ARTIFACTS, not the site.
// Recorded red: main@a060a8d lacks the AEO files, sections, canonicals and FAQ schema.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = process.env.AEO_ROOT || path.resolve(__dirname, '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8712';
const OUT = process.env.AEO_ARTIFACTS || '/tmp/standbybooth-aeo-qa';
let failures = 0;
const check = (label, ok, detail = '') => {
  console.log((ok ? 'PASS ' : 'FAIL ') + label + (detail ? ': ' + detail : ''));
  if (!ok) failures++;
};
const normal = s => s.replace(/\s+/g, ' ').trim();
(async () => {
  for (const f of ['aeo.css','robots.txt','sitemap.xml','llms.txt','assets/og-image.jpg'])
    check('crawler asset exists ' + f, fs.existsSync(path.join(ROOT, f)));
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let data = [];
  try { data = scripts.map(m => JSON.parse(m[1])); } catch(e) { check('JSON-LD parses', false, e.message); }
  check('two valid JSON-LD blocks', data.length === 2);
  check('homepage canonical', html.includes('rel="canonical" href="https://standbybooth.com/"'));
  check('consent layer preserved', html.includes('src="/assets/consent.js"'));
  check('self-hosted fonts preserved', html.includes('href="/assets/fonts.css"'));
  check('Apple smart banner absent', !html.includes('name="apple-itunes-app"'));
  const llms=fs.existsSync(path.join(ROOT,'llms.txt')) ? fs.readFileSync(path.join(ROOT,'llms.txt'),'utf8') : '';
  check('removed QR sharing is not advertised', !/QR code sharing|QR sharing needs|scanning a QR code|\+ QR codes|AirDrop or QR/.test(html+llms));
  check('free retakes match released app', !/up to 3 retakes/.test(html+llms) && html.includes('up to 5 retakes') && llms.includes('up to 5 retakes'));

  for (const legal of ['privacy','terms']) {
    const text = fs.readFileSync(path.join(ROOT,legal,'index.html'),'utf8');
    check(legal+' existing page preserved', text.includes('/assets/consent.js') && text.includes('support@standbybooth.com'));
  }
  if (failures) { console.log('RED: '+failures+' structural failure(s)'); process.exitCode=1; return; }
  const browser = await chromium.launch({executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  fs.mkdirSync(OUT, {recursive:true});
  try {
    for (const [width,height] of [[375,812],[812,375],[768,1024],[1440,900]]) {
      const ctx = await browser.newContext({viewport:{width,height}, timezoneId:'America/Los_Angeles',locale:'en-US',reducedMotion:'reduce'});
      await ctx.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
      const page = await ctx.newPage(), errors=[];
      page.on('pageerror', e=>errors.push(e.message));
      await page.goto(BASE, {waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const size=width+'x'+height;
      check(size+' no page overflow', await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1));
      check(size+' no runtime exceptions', errors.length===0,errors.join('; '));
      check(size+' all page images loaded', await page.locator('img').evaluateAll(a=>a.every(i=>i.complete && i.naturalWidth>0)));
      if(width===812) {
        const b=await page.locator('.cover .appstore-badge').boundingBox();
        check(size+' App Store CTA above fold', !!b && b.y>=0 && b.y+b.height<=height);
      }
      const entities=data.find(d=>d['@type']==='FAQPage').mainEntity;
      const visible=await page.locator('#faq details').evaluateAll(a=>a.map(el=>({q:el.querySelector('summary').textContent,a:[...el.children].filter(e=>e.tagName!=='SUMMARY').map(e=>e.textContent).join(' ')})));
      check(size+' 13 FAQ entries',visible.length===13 && entities.length===13);
      check(size+' visible FAQ equals schema',visible.every((f,i)=>normal(f.q)===normal(entities[i].name) && normal(f.a)===normal(entities[i].acceptedAnswer.text)));
      const localLinks=await page.locator('a[href],img[src],script[src],link[href],source[src],video[poster]').evaluateAll(els=>els.map(e=>e.getAttribute('href')||e.getAttribute('src')||e.getAttribute('poster')).filter(Boolean));
      for (const link of [...new Set(localLinks)]) {
        const u=new URL(link,BASE);
        if(u.origin!==new URL(BASE).origin && u.hostname!=='standbybooth.com') continue;
        if(u.hash && u.pathname==='/') {
          check(size+' anchor '+u.hash, await page.locator('[id="'+decodeURIComponent(u.hash.slice(1))+'"]').count()>0);
        } else {
          let target=path.join(ROOT,decodeURIComponent(u.pathname));
          if(fs.existsSync(target) && fs.statSync(target).isDirectory()) target=path.join(target,'index.html');
          check(size+' local reference '+u.pathname,fs.existsSync(target));
        }
      }
      await page.screenshot({path:path.join(OUT,size+'-light.png'),fullPage:true});
      const first=page.locator('#faq details').first();
      await first.locator('summary').click();
      check(size+' FAQ opens',await first.getAttribute('open')!==null);
      await first.locator('summary').click();
      check(size+' FAQ closes',await first.getAttribute('open')===null);
      await page.locator('#themeToggle').click();
      check(size+' dark theme toggles',await page.locator('html').getAttribute('data-theme')==='dark');
      await page.screenshot({path:path.join(OUT,size+'-dark.png'),fullPage:true});
      await page.locator('#themeToggle').click();
      check(size+' theme toggles back',await page.locator('html').getAttribute('data-theme')==='light');
      for(const id of ['t-loop','t-brand','t-store','t-event']) {
        await page.locator('#'+id).click();
        const target=await page.locator('#'+id).getAttribute('aria-controls');
        check(size+' tab '+id,await page.locator('#'+target).isVisible());
      }
      await ctx.close();
    }
  } finally { await browser.close(); }
  console.log(failures ? 'RED: '+failures+' failure(s)' : 'ALL AEO CHECKS PASSED');
  process.exitCode=failures?1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
