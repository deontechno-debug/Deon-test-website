/* PASS 3 (consistency) + PASS 5 (sidebar) structural probe across content templates. */
import puppeteer from 'puppeteer';
const ORIGIN = 'http://localhost:3000/';
const PAGES = [
  ['home', 'index.html', { crumb: false }],
  ['market', 'market.html?m=electrical', {}],
  ['segment', 'segment.html?seg=electrical-cable-harnessing', {}],
  ['application', 'application.html?app=wire-harnessing', {}],
  ['products-family', 'products.html?family=electrical-tapes', {}],
  ['product', 'product.html?p=deon-et-pvc15', {}],
  ['products-hub', 'products.html', {}],
  ['applications-hub', 'applications.html', {}],
  ['knowledge', 'knowledge-center.html', {}],
  ['press', 'press.html', {}],
  ['about', 'about.html', {}],
  ['manufacturing', 'manufacturing-technology.html', {}],
  ['careers', 'careers.html', {}],
  ['contact', 'contact.html', {}],
  ['converter', 'converter-partners.html', {}],
  ['oem', 'oem-partners.html', {}],
];
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const rows = [];
for (const [name, url, opt] of PAGES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await p.goto(ORIGIN + url, { waitUntil: 'networkidle0' });
  await p.evaluate(() => new Promise(r => setTimeout(r, 80)));
  // open sidebar to inspect active states
  await p.evaluate(() => { const x = document.querySelector('.nav-hamburger'); x && x.click(); });
  await p.evaluate(() => new Promise(r => setTimeout(r, 350)));
  const m = await p.evaluate(() => {
    const q = s => document.querySelector(s);
    const crumb = q('.context-bar .crumb');
    const crumbItems = crumb ? [...crumb.querySelectorAll('a,.crumb-current')].map(e => e.textContent.trim()) : [];
    const crumbCurrent = crumb ? (q('.context-bar .crumb-current') ? q('.context-bar .crumb-current').textContent.trim() : null) : null;
    const h1 = q('#deon-main h1');
    const cta = q('.cta-strip') || q('.cta-btn');
    const footer = q('footer');
    const navActiveSection = q('.nav-links a.is-active-section');
    const sidebarActive = [...document.querySelectorAll('.nav-sidebar a.is-active')].map(a => (a.textContent || '').trim()).filter(Boolean);
    return {
      hasCrumb: !!crumb, crumbItems, crumbCurrent,
      hasH1: !!h1, h1: h1 ? h1.textContent.trim().slice(0, 40) : null,
      hasCTA: !!cta, ctaType: q('.cta-strip') ? 'cta-strip' : (q('.cta-btn') ? 'cta-btn' : null),
      hasFooter: !!footer,
      navActiveSection: navActiveSection ? navActiveSection.textContent.trim() : null,
      sidebarActive,
    };
  });
  rows.push({ name, url, opt, m });
  await p.close();
}
await b.close();

console.log('PAGE              crumb  h1   CTA        navActive       sidebarActive');
for (const r of rows) {
  const m = r.m;
  const crumbFlag = (r.opt.crumb === false) ? (m.hasCrumb ? 'UNEXPECTED' : 'n/a') : (m.hasCrumb ? 'yes' : '** MISSING **');
  console.log(
    r.name.padEnd(17),
    crumbFlag.padEnd(6),
    (m.hasH1 ? 'yes' : 'NO').padEnd(4),
    (m.hasCTA ? (m.ctaType) : 'NONE').padEnd(10),
    (m.navActiveSection || '-').padEnd(15),
    (m.sidebarActive.join(',') || '-')
  );
}
console.log('\nDETAIL — breadcrumb current vs page + footer presence:');
for (const r of rows) {
  const m = r.m;
  console.log('  ' + r.name.padEnd(17) + ' footer=' + (m.hasFooter ? 'yes' : 'NO') + '  crumbCurrent="' + (m.crumbCurrent || '') + '"  trail=[' + m.crumbItems.join(' > ') + ']');
}
