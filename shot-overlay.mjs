import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// Keep every shot under the API's 2000px-per-side cap for many-image requests
// so Claude can always read it back (see screenshot.mjs for the full why).
const MAX_SIDE = 1960;
function clampForVision(file) {
  try {
    execFileSync('sips', ['-Z', String(MAX_SIDE), file], { stdio: 'ignore' });
  } catch (e) {
    console.warn(`Image clamp skipped (sips unavailable): ${e.message}`);
  }
}

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000/index.html';
const query = process.argv[3] || '';
const label = process.argv[4] || 'overlay';

const dir = path.join(ROOT, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}-${label}.png`))) n++;
const filepath = path.join(dir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.click('#searchBtn');
await new Promise(r => setTimeout(r, 450));
if (query) { await page.type('#searchInput', query, { delay: 35 }); await new Promise(r => setTimeout(r, 500)); }
await page.screenshot({ path: filepath }); // viewport only — overlay sits at top
await browser.close();
clampForVision(filepath);
console.log(`Saved: temporary screenshots/${path.basename(filepath)}`);
