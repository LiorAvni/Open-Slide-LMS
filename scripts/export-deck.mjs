import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import { unzipSync } from 'fflate';
import fs from 'node:fs';
import path from 'node:path';

const EDGE = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = process.env.DECK_URL || 'http://localhost:5173/s/library-project';
const OUT = path.resolve('exports');
const PPTX_FINAL = path.join(OUT, 'library-management-system.pptx');
const PDF_FINAL = path.join(OUT, 'library-management-system.pdf');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clearOld() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) {
    if (/\.(pptx|crdownload)$/i.test(f)) fs.rmSync(path.join(OUT, f), { force: true });
  }
}

async function waitForPptx(timeoutMs) {
  const start = Date.now();
  let lastSize = -1;
  let stable = 0;
  while (Date.now() - start < timeoutMs) {
    const files = fs.readdirSync(OUT);
    const inProgress = files.some((f) => f.endsWith('.crdownload'));
    const done = files.find((f) => f.toLowerCase().endsWith('.pptx'));
    if (done && !inProgress) {
      const size = fs.statSync(path.join(OUT, done)).size;
      if (size > 0 && size === lastSize) {
        if (++stable >= 2) return path.join(OUT, done);
      } else {
        stable = 0;
      }
      lastSize = size;
    }
    await sleep(500);
  }
  throw new Error('Timed out waiting for PPTX download');
}

async function buildPdfFromPptx(pptxPath) {
  const buf = new Uint8Array(fs.readFileSync(pptxPath));
  const zip = unzipSync(buf);
  const imgNames = Object.keys(zip)
    .filter((n) => /^ppt\/media\/image\d+\.png$/i.test(n))
    .sort((a, b) => {
      const na = parseInt(a.match(/image(\d+)\.png/i)[1], 10);
      const nb = parseInt(b.match(/image(\d+)\.png/i)[1], 10);
      return na - nb;
    });
  if (!imgNames.length) throw new Error('No slide images found inside PPTX');
  const pdf = await PDFDocument.create();
  for (const name of imgNames) {
    const png = await pdf.embedPng(zip[name]);
    const page = pdf.addPage([png.width, png.height]);
    page.drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
  }
  fs.writeFileSync(PDF_FINAL, await pdf.save());
  return imgNames.length;
}

async function main() {
  clearOld();
  console.log('Launching Edge…');
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1600,900'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
    const client = await page.createCDPSession();
    await client.send('Browser.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: OUT,
      eventsEnabled: true,
    });
    console.log('Opening deck…');
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('[aria-label="Download"]', { timeout: 30000 });
    // Give fonts a moment to settle.
    await sleep(1500);
    console.log('Opening export menu…');
    await page.click('[aria-label="Download"]');
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('*')].some(
          (e) => e.textContent && e.textContent.trim().includes('image PPTX') && e.offsetParent !== null
        ),
      { timeout: 10000 }
    );
    console.log('Triggering "Export as image PPTX"…');
    await page.evaluate(() => {
      const el = [...document.querySelectorAll('[role="menuitem"],button,div,span')]
        .filter((e) => e.offsetParent !== null && e.textContent && e.textContent.trim().includes('image PPTX'))
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      el.click();
    });
    console.log('Rendering pages & waiting for download (this can take a minute)…');
    const pptxPath = await waitForPptx(180000);
    fs.copyFileSync(pptxPath, PPTX_FINAL);
    if (path.resolve(pptxPath) !== path.resolve(PPTX_FINAL)) fs.rmSync(pptxPath, { force: true });
    console.log('PPTX saved:', PPTX_FINAL, fs.statSync(PPTX_FINAL).size, 'bytes');
    const n = await buildPdfFromPptx(PPTX_FINAL);
    console.log('PDF saved:', PDF_FINAL, fs.statSync(PDF_FINAL).size, 'bytes', `(${n} pages)`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error('EXPORT FAILED:', e.message);
  process.exit(1);
});
