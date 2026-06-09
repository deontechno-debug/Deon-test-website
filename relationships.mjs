/* PASS 2 — content-relationship integrity. Traverse the catalog graph and verify
   every edge resolves and no node is a dead-end. Read-only. */
import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
const out = await p.evaluate(() => {
  const D = window.DEON, R = D.raw;
  const issues = [];
  const note = (sev, msg) => issues.push({ sev, msg });

  // id sets
  const segIds = new Set(R.segments.map(s => s.id));
  const appIds = new Set(R.applications.map(a => a.id));
  const famIds = new Set(R.productFamilies.map(f => f.id));
  const mktIds = new Set(R.markets.map(m => m.id));
  const prodIds = new Set(R.products.map(pr => pr.id));

  // 1. every product -> valid family
  R.products.forEach(pr => { if (!famIds.has(pr.familyId)) note('ERROR', 'product ' + pr.id + ' -> missing family ' + pr.familyId); });
  // 2. every family has >=1 product (no dead-end family)
  R.productFamilies.forEach(f => { if (!D.productsForFamily(f.id).length) note('WARN', 'family ' + f.id + ' has 0 products (dead-end)'); });
  // 3. every segment -> valid market (reverse)
  R.segments.forEach(s => { const m = D.marketForSegment ? D.marketForSegment(s.id) : null; if (!m) note('WARN', 'segment ' + s.id + ' has no parent market'); });
  // 4. every market has >=1 segment OR is special/single-page
  R.markets.forEach(m => {
    const segs = D.segmentsForMarket(m.id);
    if (!segs.length && !m.special && !(m.page && m.page !== '#')) note('WARN', 'market ' + m.id + ' has 0 segments and is not special/single-page (dead-end)');
  });
  // 5. every application -> >=1 market (else orphan/undiscoverable)
  R.applications.forEach(a => { if (!D.marketsForApplication(a.id).length) note('WARN', 'application ' + a.id + ' maps to 0 markets (undiscoverable via market path)'); });
  // 6. every application -> >=1 product family (else no product path)
  R.applications.forEach(a => { const ff = D.productFamiliesForApplication ? D.productFamiliesForApplication(a.id) : []; if (!ff.length) note('INFO', 'application ' + a.id + ' -> 0 product families'); });
  // 7. every market -> >=1 application
  R.markets.forEach(m => { if (!m.special && !D.applicationsForMarket(m.id).length) note('WARN', 'market ' + m.id + ' -> 0 applications'); });
  // 8. application groups cover every application exactly once
  const grouped = {};
  (window.DEON_ARCH.applicationGroups || []).forEach(g => g.apps.forEach(a => { grouped[a.id] = (grouped[a.id] || 0) + 1; }));
  R.applications.forEach(a => {
    const n = grouped[a.id] || 0;
    if (n === 0) note('ERROR', 'application ' + a.id + ' is in NO application group (missing from sidebar drill)');
    if (n > 1) note('WARN', 'application ' + a.id + ' is in ' + n + ' application groups (duplicate)');
  });
  // 9. group apps reference real applications
  (window.DEON_ARCH.applicationGroups || []).forEach(g => g.apps.forEach(a => { if (!appIds.has(a.id)) note('ERROR', 'group "' + g.name + '" references unknown application ' + a.id); }));
  // 10. every family -> >=1 application (reverse discoverability)
  R.productFamilies.forEach(f => { const aa = D.applicationsForFamily ? D.applicationsForFamily(f.id) : []; if (!aa.length) note('INFO', 'family ' + f.id + ' -> 0 applications'); });

  const counts = {
    markets: R.markets.length, segments: R.segments.length, applications: R.applications.length,
    productFamilies: R.productFamilies.length, products: R.products.length,
    resources: (R.resources || []).length, technologies: (R.technologies || []).length, insights: (R.insights || []).length,
  };
  return { counts, issues };
});
console.log('CATALOG:', JSON.stringify(out.counts));
const bySev = { ERROR: [], WARN: [], INFO: [] };
out.issues.forEach(i => bySev[i.sev].push(i.msg));
['ERROR', 'WARN', 'INFO'].forEach(sev => {
  console.log('\n' + sev + ' (' + bySev[sev].length + '):');
  bySev[sev].slice(0, 40).forEach(m => console.log('  ' + m));
});
await b.close();
