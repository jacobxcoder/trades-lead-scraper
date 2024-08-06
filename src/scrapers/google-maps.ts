import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import log from '$/utils/logger';
import { trimNonAlphanumeric } from '$/utils/string.utils';
import type { Trades, Location, Business } from '$/types';

const limit = 2;

async function handleFacebookPage(page: Page) {}

async function processSingleCarpenter(browser: Browser, link: ElementHandle) {
  log.info('Processing a link...');

  const hrefHandle = await link.getProperty('href');
  const href = await hrefHandle.jsonValue();

  if (typeof href !== 'string') {
    log.error('The href is not a string. Skipping...');
    return;
  }

  if (href.includes('support') && href.includes('answer')) {
    log.note('Encountered a support link. Skipping');
    return;
  }

  // Release the handle for garbage collection
  await hrefHandle?.dispose();

  // Open a new tab for that specific link (carpenter)
  const page = await browser.newPage();
  await page.goto(href);
  await page.setViewport({ width: 1920, height: 1080 });

  const business: Business = {
    name: undefined,
    address: undefined,
    phone: undefined,
    website: undefined,
    email: undefined
  };

  interface Process {
    selector: string;
    key: keyof Business;
  }

  // This object determines the process of scraping
  // the business information from the page from particular DOM elements
  // based on the selectors provided
  const process: Process[] = [
    {
      selector: 'h1',
      key: 'name'
    },
    {
      selector: 'button[data-item-id="address"]',
      key: 'address'
    },
    {
      selector: 'a[data-item-id="authority"]',
      key: 'website'
    },
    {
      selector: 'button[data-item-id^="phone:"]',
      key: 'phone'
    }
  ];

  // Create an array of promises for each of the business info that we need
  const processes: Array<Promise<void>> = [];

  for (const { selector, key } of process) {
    const handle = await page.$(selector);
    business[key] = (await handle?.evaluate((el) => el.textContent)) || undefined;

    // We need to clean the string from strange characters
    // that may appear when using .textContent
    if (business[key]) {
      business[key] = trimNonAlphanumeric(business[key]);
    }

    // Release the handle for garbage collection
    await handle?.dispose();
  }

  await Promise.all(processes);

  console.log('business: ', business);

  await page.click('h1'); // focus on the left section of the page

  // A workaround to lazy loading of the content?
  await page.mouse.wheel({ deltaY: 20000 });

  await new Promise((resolve) => {
    setTimeout(async () => {
      await page.mouse.wheel({ deltaY: 10000 });
      return resolve('done');
    }, 1000);
  });

  await new Promise((resolve) => {
    setTimeout(async () => {
      await page.mouse.wheel({ deltaY: 10000 });
      return resolve('done');
    }, 1000);
  });

  await new Promise((resolve) => {
    setTimeout(async () => {
      const lastH2 = await page
        .$$('div[role="main"] h2')
        .then((els) => els[els.length - 1]);
      console.log('lastH2: ', lastH2);
      console.log('lastH2 content: ', await lastH2?.evaluate((el) => el.textContent));

      try {
        await lastH2?.click();
      } catch (e) {
        console.error('error: ', e);
      }

      resolve('done');
    }, 500);
  });

  const frames = page.frames();

  let headings: string[] = [];

  for (const frame of frames) {
    headings = await frame.$$eval('g-card-section', (gCards) => {
      const relatedLinks: string[] = [];

      for (const gCard of gCards) {
        const element = gCard.querySelector('div[role="heading"][aria-level="3"]');

        if (
          element?.textContent &&
          (element.textContent.toLowerCase().includes('facebook') ||
            element.textContent.toLowerCase().includes('instagram'))
        ) {
          relatedLinks.push(element.textContent);
        } else {
          continue;
        }

        // Try to get an email from Instagram or Facebook
        // @ts-ignore
        (element as any)?.click(); // @ts-ignore
        await browser.waitForTarget(async (target) => {
          const url = target.url();
          if (url.includes('facebook')) {
            await handleFacebookPage(await target.page());
            return true;
          }
        });
      }

      return relatedLinks;
    });
  }

  console.log('headings: ', headings);

  // At the end, close this page
  // await page.close();
}

export default async function (trade: Trades, location: Location) {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.goto('https://google.com/maps');
  await page.setViewport({ width: 1920, height: 1080 });

  await page.locator('form button span').click();
  log.info('Skipped Google consent screen.');

  log.pending('Trying to search for trade and location...');

  // Fill in the search bar with a proper phrase
  await page
    .locator('input#searchboxinput')
    .fill(`${trade} in ${location.city}, ${location.state}, ${location.country}`);

  // Click the enter to start the search
  // and wait for the new page to load
  await page.locator('button#searchbox-searchbutton').click();
  await page.waitForFunction(
    (initialUrl) =>
      window.location.href !== initialUrl && window.location.href.includes('search'),
    {},
    page.url()
  );

  const mainDiv = await page.$('div[role="main"]');

  if (!mainDiv) {
    log.error(
      'Something has changed. We could not find the main div on the Google Maps page. Exiting...'
    );
    throw new Error('div[role="main"] could not be found on Google Maps');
  }

  const links = await mainDiv.$$('a');

  if (!links || !links.length) {
    log.error('No entries found on Google Maps for this query. Exiting...');
    throw new Error('The links array does not exist or is empty');
  }

  for (let i = 0; i < Math.min(limit, links.length); i++)
    processSingleCarpenter(browser, links[i]);

  console.log('Scraping from Google Maps...: ', trade, location);

  // await browser.close();
}
