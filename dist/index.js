"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const logger_1 = __importDefault(require("$/logger"));
const google_maps_1 = __importDefault(require("$/google-maps"));
const program = (0, commander_1.createCommand)();
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
logger_1.default.start(`Options parsed correctly. Fetching all ${options.trade} for ${options.city}, ${options.state}.`);
scrape();
async function scrape() {
    const result = await (0, google_maps_1.default)(options.trade, {
        city: options.city,
        state: options.state,
        country: options.country,
    });
}
