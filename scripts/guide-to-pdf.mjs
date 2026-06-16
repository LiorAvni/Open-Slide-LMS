import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML = 'C:\\_Lior_\\School\\project\\FINAL3\\LibraryManagementSystem\\Other\\Exam_Study_Guide\\index.html';
const OUT = 'C:\\_Lior_\\School\\project\\FINAL3\\LibraryManagementSystem\\Other\\Exam_Study_Guide\\מדריך_לימוד_לבחינה.pdf';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(HTML).href, { waitUntil: 'networkidle0', timeout: 120000 });

  // make sure web fonts are fully loaded before printing
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 800));

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    scale: 1,
    margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
    preferCSSPageSize: false,
  });

  console.log('PDF written to: ' + OUT);
} finally {
  await browser.close();
}
