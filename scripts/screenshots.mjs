import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.env.GF_URL || 'http://localhost:5180';
const OUT = join(process.cwd(), 'docs', 'screenshots');
mkdirSync(OUT, { recursive: true });

const SHOTS = [
  {
    name: 'welcome',
    viewport: { width: 1440, height: 1500, deviceScaleFactor: 2 },
    setup: async (page) => {
      await page.evaluate(() => {
        localStorage.removeItem('guestflow.welcomed.v1');
      });
      await page.goto(BASE + '/?welcome=1', { waitUntil: 'networkidle2' });
    },
    fullPage: true,
  },
  {
    name: 'next-actions',
    viewport: { width: 1440, height: 1000, deviceScaleFactor: 2 },
    setup: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('guestflow.welcomed.v1', '1');
      });
      await page.goto(BASE, { waitUntil: 'networkidle2' });
    },
    fullPage: false,
  },
  {
    name: 'guest-portal',
    viewport: { width: 1440, height: 2000, deviceScaleFactor: 2 },
    setup: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('guestflow.welcomed.v1', '1');
      });
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.nav-list button')];
        const target = buttons.find((b) => b.textContent.trim() === 'Guest Portal');
        target?.click();
      });
      await new Promise((r) => setTimeout(r, 400));
      await page.evaluate(() => {
        const select = document.querySelector('.select-guest select');
        if (!select) return;
        const target = [...select.options].find((o) => o.textContent.includes('Andre'));
        if (target) {
          select.value = target.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await new Promise((r) => setTimeout(r, 300));
    },
    fullPage: true,
  },
  {
    name: 'pipeline',
    viewport: { width: 1600, height: 1100, deviceScaleFactor: 2 },
    setup: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('guestflow.welcomed.v1', '1');
      });
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.nav-list button')];
        const target = buttons.find((b) => b.textContent.trim() === 'Guest Pipeline');
        target?.click();
      });
      await new Promise((r) => setTimeout(r, 400));
    },
    fullPage: false,
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  defaultViewport: null,
});

try {
  const bootstrap = await browser.newPage();
  await bootstrap.goto(BASE, { waitUntil: 'networkidle2' });

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewport(shot.viewport);
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await shot.setup(page);
    await page.waitForSelector('body');
    await new Promise((r) => setTimeout(r, 500));
    const file = join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: shot.fullPage, type: 'png' });
    console.log('wrote', file);
    await page.close();
  }
} finally {
  await browser.close();
}
