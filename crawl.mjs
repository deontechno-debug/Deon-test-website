/* DEON hardening crawler — renders every catalog route, validates links against
   the real id-sets, records element ids for anchor checks, captures JS errors,
   computes orphans + dead links + placeholder markers. Read-only. */
import puppeteer from 'puppeteer';
import { readFileSync, readdirSync, writeFileSync } from 'fs';

const ORIGIN = 'http://localhost:3000/';
const pageFiles = new Set(readdirSync('.').filter(f => f.endsWith('.html')));

const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

// ---- Stage A: enumerate canonical URLs + valid id-sets from the live catalog ----
const enumPage = await b.newPage();
await enumPage.goto(ORIGIN + 'index.html', { waitUntil: 'networkidle0' });
const cat = await enumPage.evaluate(() => {
  const D = window.DEON, R = D.raw, U = D.url;
  const ids = {
    market: R.markets.map(m => m.id),
    segment: R.segments.map(s => s.id),
    application: R.applications.map(a => a.id),
    family: R.productFamilies.map(f => f.id),
    product: R.products.map(p => p.id),
  };
  const urls = [];
  R.markets.forEach(m => urls.push(U.market(m.id)));
  R.segments.forEach(s => urls.push(U.segment(s.id)));
  R.applications.forEach(a => urls.push(U.application(a.id)));
  R.productFamilies.forEach(f => urls.push(U.productFamily(f.id)));
  R.products.forEach(p => urls.push(U.product(p.id)));
  return { ids, urls };
});

// every html file (param-less templates included) + every catalog route
const seeds = new Set(['index.html', ...[...pageFiles], ...cat.urls]);

// ---- Stage B: BFS crawl ----
const page = await b.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.setRequestInterception(true);
page.on('request', req => {
  const t = req.resourceType();
  if (t === 'image' || t === 'media' || t === 'font') return req.abort();
  req.continue();
});

const PLACEHOLDER_RE = /\b(lorem ipsum|TODO|FIXME|TBD|\{\{|\}\}|\[object Object\]|undefined|NaN|coming soon|placeholder text)\b/i;

const visited = new Set();
const queue = [...seeds];
const pages = {};            // normalizedUrl -> { links:[{href,text}], ids:[], errors:[], textLen, placeholder:[], title }
const redirects = {};        // stub url -> landed url
const allTargets = new Set(); // every internal link target seen (normalized, file+query, no hash)

function norm(u) {
  if (!u) return u;
  return u.replace(/^\.\//, '').replace(ORIGIN, '').replace(/^\//, '');
}
function keyNoHash(u) { return norm(u).split('#')[0]; }

while (queue.length) {
  const raw = queue.shift();
  const nu = norm(raw);
  if (visited.has(nu)) continue;
  visited.add(nu);
  const fileOnly = nu.split('?')[0].split('#')[0];
  if (!pageFiles.has(fileOnly)) continue; // off-site / non-page; validated as a link below

  const errors = [];
  const onErr = e => errors.push(String(e));
  const onConsole = m => { if (m.type() === 'error') errors.push('console: ' + m.text()); };
  page.on('pageerror', onErr);
  page.on('console', onConsole);
  try {
    await page.goto(ORIGIN + nu, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) { errors.push('NAV: ' + String(e)); }

  // redirect stubs (electronics/capabilities/resources, market.html w/o ?m=) do a
  // client-side location.replace — record the redirect and skip content checks so
  // the detached frame doesn't crash the crawl.
  let landed = nu;
  try { landed = norm(page.url()); } catch (e) {}
  if (landed.split('?')[0].split('#')[0] !== fileOnly) {
    redirects[nu] = landed;
    pages[nu] = { links: [], ids: [], errors, textLen: 0, title: '', placeholder: [], redirectedTo: landed };
    page.off('pageerror', onErr); page.off('console', onConsole);
    const lf = landed.split('?')[0].split('#')[0];
    if (pageFiles.has(lf) && !visited.has(landed)) queue.push(landed);
    continue;
  }

  let data = { links: [], ids: [], textLen: 0, title: '', bodyText: '' };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await page.evaluate(() => new Promise(r => setTimeout(r, 60)));
      data = await page.evaluate(() => {
        const out = { links: [], ids: [], textLen: 0, title: document.title };
        document.querySelectorAll('[id]').forEach(el => out.ids.push(el.id));
        document.querySelectorAll('a[href]').forEach(a => {
          out.links.push({ href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 40) });
        });
        const main = document.getElementById('deon-main') || document.body;
        out.textLen = (main.innerText || '').trim().length;
        out.bodyText = (document.body.innerText || '');
        return out;
      });
      break;
    } catch (e) { if (attempt === 1) errors.push('EVAL: ' + String(e)); }
  }
  page.off('pageerror', onErr);
  page.off('console', onConsole);

  const placeholder = [];
  const mt = data.bodyText.match(PLACEHOLDER_RE);
  if (mt) placeholder.push(mt[0]);

  pages[nu] = { links: data.links, ids: data.ids, errors, textLen: data.textLen, title: data.title, placeholder };

  // enqueue internal links
  for (const l of data.links) {
    const h = l.href;
    if (!h || /^(mailto:|tel:|https?:|#)/i.test(h)) continue;
    allTargets.add(keyNoHash(h));
    const nh = norm(h);
    const f = nh.split('?')[0].split('#')[0];
    if (pageFiles.has(f) && !visited.has(nh)) queue.push(nh);
  }
}

// ---- Stage C: validate ----
const broken = [];   // missing file or dangling param id or bad anchor
const dead = [];     // href="#" or empty (JS-driven or placeholder)
const external = new Set();
const paramKey = { m: 'market', seg: 'segment', app: 'application', family: 'family', p: 'product' };

function anchorsFor(file) {
  // collect ids across every crawled url whose file == file (anchors may render per-variant; union is lenient)
  const set = new Set();
  for (const [u, d] of Object.entries(pages)) if (u.split('?')[0].split('#')[0] === file) d.ids.forEach(i => set.add(i));
  return set;
}

for (const [srcUrl, d] of Object.entries(pages)) {
  for (const l of d.links) {
    const h = l.href;
    if (!h) { dead.push({ src: srcUrl, href: h, text: l.text }); continue; }
    if (/^(mailto:|tel:)/i.test(h)) continue;
    if (/^https?:/i.test(h)) { external.add(h.split('/').slice(0, 3).join('/')); continue; }
    if (h === '#' || h === '') { dead.push({ src: srcUrl, href: h, text: l.text }); continue; }
    if (h.startsWith('#')) { // same-page anchor
      const id = h.slice(1);
      if (id && !d.ids.includes(id)) broken.push({ src: srcUrl, href: h, text: l.text, why: 'same-page anchor id missing' });
      continue;
    }
    const nh = norm(h);
    const file = nh.split('?')[0].split('#')[0];
    const query = (nh.split('?')[1] || '').split('#')[0];
    const hash = nh.split('#')[1] || '';
    if (!pageFiles.has(file)) { broken.push({ src: srcUrl, href: h, text: l.text, why: 'missing file ' + file }); continue; }
    // validate param ids
    if (query) {
      const params = new URLSearchParams(query);
      for (const [k, v] of params) {
        const kind = paramKey[k];
        if (kind && cat.ids[kind] && !cat.ids[kind].includes(v))
          broken.push({ src: srcUrl, href: h, text: l.text, why: 'dangling ' + kind + ' id "' + v + '"' });
      }
    }
    // validate cross-page anchor
    if (hash) {
      const set = anchorsFor(file);
      if (set.size && !set.has(hash))
        broken.push({ src: srcUrl, href: h, text: l.text, why: 'anchor #' + hash + ' missing on ' + file });
    }
  }
}

// ---- orphans: canonical entity URLs never linked-to ----
const canonical = cat.urls.map(keyNoHash);
const linkedTargets = new Set([...allTargets].map(keyNoHash));
const orphanRoutes = canonical.filter(u => !linkedTargets.has(u));

// pages with JS errors / empty content
// exclude resource-load noise caused by THIS crawler aborting image/font requests
const ERR_NOISE = /Failed to load resource|ERR_FAILED|net::ERR/i;
const jsErrorPages = Object.entries(pages)
  .map(([u, d]) => ({ url: u, errors: d.errors.filter(e => !ERR_NOISE.test(e)) }))
  .filter(x => x.errors.length);
const emptyPages = Object.entries(pages).filter(([, d]) => d.textLen < 80 && !d.redirectedTo).map(([u, d]) => ({ url: u, textLen: d.textLen }));
const placeholderPages = Object.entries(pages).filter(([, d]) => d.placeholder.length).map(([u, d]) => ({ url: u, hit: d.placeholder }));

const report = {
  summary: {
    pagesCrawled: Object.keys(pages).length,
    canonicalRoutes: canonical.length,
    brokenLinks: broken.length,
    deadHashLinks: dead.length,
    orphanRoutes: orphanRoutes.length,
    jsErrorPages: jsErrorPages.length,
    emptyPages: emptyPages.length,
    placeholderTextPages: placeholderPages.length,
    redirectStubs: Object.keys(redirects).length,
  },
  redirects, broken, orphanRoutes, jsErrorPages, emptyPages, placeholderPages,
  deadSample: dead.slice(0, 20), deadCount: dead.length,
  external: [...external],
};
writeFileSync('crawl-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
console.log('\nBROKEN (' + broken.length + '):');
broken.slice(0, 40).forEach(x => console.log('  [' + x.src + '] ' + x.href + ' — ' + x.why));
console.log('\nORPHAN ROUTES (' + orphanRoutes.length + '):');
orphanRoutes.slice(0, 40).forEach(x => console.log('  ' + x));
console.log('\nJS ERROR PAGES (' + jsErrorPages.length + '):');
jsErrorPages.slice(0, 20).forEach(x => console.log('  ' + x.url + ' :: ' + x.errors.slice(0, 2).join(' | ')));
console.log('\nEMPTY PAGES (' + emptyPages.length + '):');
emptyPages.forEach(x => console.log('  ' + x.url + ' (len ' + x.textLen + ')'));
console.log('\nDEAD #/empty hrefs:', dead.length, '(sample below)');
[...new Set(dead.map(x => x.href + ' :: ' + x.text))].slice(0, 12).forEach(x => console.log('  ' + x));

await b.close();
