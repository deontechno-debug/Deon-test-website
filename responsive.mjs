/* PASS 4 — responsive audit. Render representative templates at 6 widths and
   detect horizontal overflow / clipping. Read-only. */
import puppeteer from 'puppeteer';
const WIDTHS = [390, 768, 1024, 1440, 1920, 2560];
// one representative URL per distinct template
const URLS = [
  ['home', 'index.html'],
  ['market', 'market.html?m=electrical'],
  ['segment', 'segment.html?seg=electrical-cable-harnessing'],
  ['application', 'application.html?app=wire-harnessing'],
  ['products-family', 'products.html?family=electrical-tapes'],
  ['product', 'product.html?p=deon-et-pvc15'],
  ['products-hub', 'products.html'],
  ['applications-hub', 'applications.html'],
  ['knowledge', 'knowledge-center.html'],
  ['press', 'press.html'],
  ['about', 'about.html'],
  ['manufacturing', 'manufacturing-technology.html'],
  ['careers', 'careers.html'],
  ['contact', 'contact.html'],
  ['converter', 'converter-partners.html'],
  ['oem', 'oem-partners.html'],
];
const ORIGIN = 'http://localhost:3000/';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const findings = [];
for (const [name, url] of URLS) {
  const p = await b.newPage();
  for (const w of WIDTHS) {
    await p.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await p.goto(ORIGIN + url, { waitUntil: 'networkidle0', timeout: 30000 });
    await p.evaluate(() => new Promise(r => setTimeout(r, 80)));
    const m = await p.evaluate((vw) => {
      const de = document.documentElement;
      const horiz = Math.max(de.scrollWidth - de.clientWidth, document.body.scrollWidth - document.body.clientWidth);
      // genuinely UNCONTAINED overflow: element extends past the viewport AND no
      // ancestor clips it (overflow-x hidden/auto/scroll/clip). Carousels/rails are
      // contained, so they're correctly ignored.
      const clipped = el => {
        let n = el.parentElement;
        while (n && n !== document.documentElement) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === 'hidden' || ox === 'auto' || ox === 'scroll' || ox === 'clip') return true;
          n = n.parentElement;
        }
        return false;
      };
      const culprits = [];
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1.5 || r.left < -1.5) {
          const cls = (el.className && el.className.toString) ? el.className.toString() : '';
          if (/nav-sidebar|nav-overlay/.test(cls)) continue;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed') continue;
          if (clipped(el)) continue;
          culprits.push({ tag: el.tagName.toLowerCase(), cls: cls.slice(0, 40), right: Math.round(r.right), left: Math.round(r.left) });
        }
      }
      return { horiz: Math.round(horiz), culprits: culprits.slice(0, 8), culpritCount: culprits.length };
    }, w);
    if (m.horiz > 1 || m.culpritCount > 0) {
      findings.push({ name, url, w, horiz: m.horiz, culpritCount: m.culpritCount, culprits: m.culprits });
    }
  }
  await p.close();
}
if (!findings.length) console.log('RESPONSIVE: clean — 0 horizontal overflow across ' + URLS.length + ' templates x ' + WIDTHS.length + ' widths.');
else {
  console.log('RESPONSIVE issues (' + findings.length + '):');
  for (const f of findings) {
    console.log('  [' + f.name + ' @' + f.w + 'px] horizScroll=' + f.horiz + ' culprits=' + f.culpritCount);
    f.culprits.forEach(c => console.log('      <' + c.tag + ' class="' + c.cls + '"> right=' + c.right + ' left=' + c.left));
  }
}
await b.close();
