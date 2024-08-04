import { createCommand } from 'commander';
import log from '$/logger';
import scrapeGoogleMaps from '$/google-maps';

const program = createCommand();

program
  .name('trades-leads-scraper')
  .description('A CLI tool to scrape leads (trades) from Google Maps and Yelp')
  .version('0.0.1');

program
  .requiredOption('--city <string>', 'City to scrape data from')
  .requiredOption('--state <string>', 'State to scrape data from')
  .requiredOption('--country <string>', 'Country to scrape data from', 'USA')
  .requiredOption('--trade <string>', 'Currently available trades: carpenters', 'carpenters')
  .option('-o, --output <string>', 'Output file name');

program.parse();

const options = program.opts();

log.start(`Options parsed correctly. Fetching all ${options.trade} for ${options.city}, ${options.state}.`);
scrape();

async function scrape() {
  const result = await scrapeGoogleMaps(options.trade, {
    city: options.city,
    state: options.state,
    country: options.country,
  });
}
