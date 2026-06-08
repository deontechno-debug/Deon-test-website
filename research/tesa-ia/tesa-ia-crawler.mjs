/* ============================================================
   Tesa Industry IA Reverse-Engineering Tool
   Crawls https://www.tesa.com/en/industry and extracts an
   information-architecture model (NOT content/code): URL
   inventory + hierarchy, per-page templates/modules, navigation
   structures, and cross-link relationships.

   Usage:  node tesa-ia-crawler.mjs
   Output: research/tesa-ia/data/{inventory,pages,nav}.json
   Polite: domcontentloaded + delay between requests; bounded
           deep-crawl set; single concurrency.
   ============================================================ */
import puppeteer from 'puppeteer';
import fs from 'fs';

const ORIGIN = 'https://www.tesa.com';
const ROOT = '/en/industry';
const OUT = 'research/tesa-ia/data';
const DELAY = 300;                 // politeness delay between page loads (ms)
const DEEP_CAP = 48;               // max pages to deep-extract
fs.mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

async function open(url) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 1000 });
  await p.setRequestInterception(true);
  p.on('request', req => {            // skip heavy assets — we only need DOM/structure
    const t = req.resourceType();
    if (t === 'image' || t === 'media' || t === 'font') req.abort().catch(()=>{});
    else req.continue().catch(()=>{});
  });
  let status = 0;
  try { const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 }); status = r && r.status(); }
  catch (e) {}
  await sleep(900);
  await p.evaluate(() => { const x = document.querySelector('#onetrust-accept-btn-handler'); if (x) x.click(); }).catch(()=>{});
  return { p, status };
}

const EXTRACT = (ROOT) => {
  function txt(el){ return el ? (el.textContent||'').trim().replace(/\s+/g,' ') : ''; }
  const origin = location.origin;
  function norm(h){ try{ const u=new URL(h, location.href); if(u.origin!==origin) return null; return u.pathname.replace(/\/$/,'')||'/'; }catch(e){ return null; } }
  const main = document.querySelector('main') || document.body;
  // ordered top-level module signature (component class tokens) inside main
  const mods = [];
  const blocks = main.querySelectorAll(':scope > *');
  blocks.forEach(b => {
    const cls = (typeof b.className==='string' && b.className.trim()) ? b.className.trim().split(/\s+/)[0]
      : (b.querySelector('[class]') ? b.querySelector('[class]').className.trim().split(/\s+/)[0] : '');
    const base = cls.split('__')[0];
    if (base && !/^(grid-row|container|skeleton|v-portal)$/.test(base)) mods.push(base);
  });
  const h2 = [...document.querySelectorAll('main h2')].map(txt).filter(Boolean).slice(0,20);
  const ctaWords = /(get in touch|contact|let'?s go|discover more|find out|learn more|request|get started|download|explore)/i;
  const ctas = [...document.querySelectorAll('main a, main button')].map(txt).filter(t=>t && ctaWords.test(t) && t.length<40);
  const downloads = [...document.querySelectorAll('a[href$=".pdf"], a[href*="download" i], a[download]')].map(a=>txt(a)).filter(Boolean);
  // internal industry links (for relationship graph + frontier)
  const links = [...new Set([...document.querySelectorAll('main a[href]')].map(a=>norm(a.getAttribute('href'))).filter(Boolean))];
  return {
    title: document.title, h1: txt(document.querySelector('h1')),
    modules: [...new Set(mods)], moduleSeq: mods.slice(0,14), h2,
    ctas: [...new Set(ctas)].slice(0,8), downloads: downloads.slice(0,12), downloadCount: downloads.length,
    links,
  };
};

// ---------- Phase 1: harvest inventory + nav from the landing + hubs ----------
console.error('[1] harvesting inventory…');
const inventory = new Set();
const allLinks = new Set();
const navData = {};
{
  const { p } = await open(ORIGIN + ROOT);
  const r = await p.evaluate(() => {
    function txt(el){ return el?(el.textContent||'').trim().replace(/\s+/g,' '):''; }
    const origin = location.origin;
    function norm(h){ try{ const u=new URL(h, location.href); if(u.origin!==origin) return null; return u.pathname.replace(/\/$/,'')||'/'; }catch(e){ return null; } }
    const all = [...document.querySelectorAll('a[href]')];
    const links = all.map(a => ({ t: txt(a).slice(0,50), p: norm(a.getAttribute('href')) })).filter(x=>x.p);
    const top = [...document.querySelectorAll('.horizontal-nav__links a')].map(a=>({t:txt(a), href:norm(a.getAttribute('href'))})).filter(x=>x.t);
    const footer = [...document.querySelectorAll('[class*="footer" i] a')].map(a=>({t:txt(a), href:norm(a.getAttribute('href'))})).filter(x=>x.t && x.href);
    return { links, top, footer };
  });
  r.links.forEach(l => { allLinks.add(l.p); if (l.p.startsWith(ROOT)) inventory.add(l.p); });
  navData.top = r.top;
  navData.footer = r.footer.slice(0, 60);
  await p.close();
  await sleep(DELAY);
}

// locate cross-section hubs (sustainability / press / careers) from any harvested link text
function findPath(re){ return [...allLinks].find(p => re.test(p)); }
navData.sections = {
  industry: ROOT,
  markets: ROOT + '/markets', applications: ROOT + '/applications', products: ROOT + '/products',
  contact: findPath(/contact-us-industry/) || ROOT + '/contact-us-industry',
  sustainability: findPath(/sustainab/i) || null,
  press: findPath(/press|news|insight/i) || null,
  careers: findPath(/career|jobs/i) || null,
};

// ---------- Phase 2: deep-extract a curated, comprehensive set ----------
const inv = [...inventory].sort();
const depthOf = u => u.split('/').filter(Boolean).length;
const byDepth = d => inv.filter(u => depthOf(u) === d);
// curated: all hubs (d3) + all markets/app-cats/product-cats (d4) + sample of d5 + located sections
let curated = [
  ROOT,
  ...byDepth(3),
  ...byDepth(4),
  ...byDepth(5).filter((_,i)=> i % 3 === 0),      // every 3rd depth-5 page (segment/product sample)
];
[navData.sections.sustainability, navData.sections.press, navData.sections.careers, navData.sections.contact]
  .filter(Boolean).forEach(u => curated.push(u));
curated = [...new Set(curated)].slice(0, DEEP_CAP);

console.error(`[2] deep-extracting ${curated.length} pages…`);
const pages = [];
for (const path of curated) {
  const url = ORIGIN + path;
  const { p, status } = await open(url);
  let data = {};
  try { data = await p.evaluate(EXTRACT, ROOT); } catch (e) { data = { error: String(e).slice(0,80) }; }
  data.links && data.links.forEach(l => { if (l.startsWith(ROOT)) inventory.add(l); });
  pages.push({ path, depth: depthOf(path), parent: '/' + path.split('/').filter(Boolean).slice(0,-1).join('/'), status, ...data });
  console.error(`    ${status||'-'} d${depthOf(path)} ${path}`);
  await p.close();
  await sleep(DELAY);
}

await browser.close();

// final inventory (landing + any newly discovered during deep crawl)
const finalInv = [...inventory].sort();
fs.writeFileSync(`${OUT}/inventory.json`, JSON.stringify({ root: ROOT, count: finalInv.length, paths: finalInv }, null, 2));
fs.writeFileSync(`${OUT}/pages.json`, JSON.stringify(pages, null, 2));
fs.writeFileSync(`${OUT}/nav.json`, JSON.stringify(navData, null, 2));
console.error(`\nDONE. inventory=${finalInv.length} deep=${pages.length}`);
console.log(JSON.stringify({ inventory: finalInv.length, deep: pages.length, sections: navData.sections,
  templatesSeen: [...new Set(pages.map(p=>p.modules && p.modules[0]).filter(Boolean))] }, null, 2));
