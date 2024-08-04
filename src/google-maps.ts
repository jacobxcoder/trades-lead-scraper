import puppeteer from 'puppeteer';
import log from '$/logger';
import type { Trades, Location } from '$/types';

export default async function (trade: Trades, location: Location) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://google.com/maps');
  await page.setViewport({ width: 1920, height: 1080 });

  await page.locator('form button span').click();
  log.info('Skipped Google consent screen.');

  log.pending('Trying to search for trade and location...');

  await page
    .locator('input#searchboxinput')
    .fill(`${trade} in ${location.city}, ${location.state}, ${location.country}`);

  console.log('Scraping from Google Maps...: ', trade, location);

  // await browser.close();
}
