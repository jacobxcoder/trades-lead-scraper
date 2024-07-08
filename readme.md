# CLI Trades Leads Scraping

[!IMPORTANT] Currently in development. Not yet ready to use.

This is a simple CLI application which uses Python (`requests`, `beautifulsoup4`, `pandas`) to scrape and process leads list, specifically for "trades" in the US.

## Why use this tool?

This is a simple & customizable CLI application allowing to easily scrape medium to large amounts of data about trade companies.

The scraped list could be used for cold outreach.

## Currently supported options

- `--cities` (shortcut `-c`) - a list of US cities to scrape from
- `--trade` (shortcut `-t`) - what trade are you interested in? (currently available: `plumber`)

[!NOTE]
The list of US cities has been taken from the following source: https://github.com/grammakov/USA-cities-and-states

## Example of usage

First clone the repository:

```bash
git clone https://github.com/jacobxcoder/trades-lead-scraper.git
```

Enter the repo directory:

```bash
cd trades-lead-scraper
```

Install all the dependencies:

```bash
pip install -r requirements.txt
```

Run the scraper:

```bash
python scraper.py --trades=plumber --cities=Miami California
```

[!IMPORTANT]
Before scraping and using a list with this tool, make sure that you're following the law :) I do not take any responsibility for the usage of this, this is just a basic tool for me to learn web scraping in Python.