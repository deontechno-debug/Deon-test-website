import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// Anthropic's API drops the per-image cap to 2000px/side once a request
// carries many images (the whole conversation is re-sent each turn, so a long
// session is always "many images"). A fullPage shot of a long page blows past
// 2000px tall and gets stripped ("could not be processed and was removed").
// Clamp the longest side so Claude can always read the shot back. -Z only
// downscales, never upscales, and preserves aspect ratio.
const MAX_SIDE = 1960;
function clampForVision(file) {
  try {
    execFileSync('sips', ['-Z', String(MAX_SIDE), file], { stdio: 'ignore' });
  } catch (e) {
    console.warn(`Image clamp skipped (sips unavailable): ${e.message}`);
  }
}

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = path.join(ROOT, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

// Auto-increment: find next unused number
let n = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const filename = `screenshot-${n}${label ? '-' + label : ''}.png`;
const filepath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// Scroll through the page to trigger Intersection Observers, then scroll back
const totalHeight = await page.evaluate(() => document.body.scrollHeight);
const step = 400;
for (let y = 0; y <= totalHeight; y += step) {
  await page.evaluate(pos => window.scrollTo(0, pos), y);
  await new Promise(r => setTimeout(r, 120));
}
await page.evaluate(() => window.scrollTo(0, 0));
// Wait for all counter and reveal animations to complete
await new Promise(r => setTimeout(r, 1800));

await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

clampForVision(filepath);

console.log(`Saved: temporary screenshots/${filename}`);
console.log(`Path:  ${filepath}`);
