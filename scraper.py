import argparse
import pandas as pd
import requests
from loguru import logger
from bs4 import BeautifulSoup

def get_us_cities():
    logger.info('Fetching a list of all available US cities.')
    return pd.read_csv('./us_cities.csv', sep='|')['City'].to_list()

def main():
    logger.info('Analyzing your arguments.')

    us_cities = get_us_cities()
    logger.success('Fetched a list of all US cities succesfully.')

    parser = argparse.ArgumentParser(
        prog='trades-scraper',
        description='This script scrapes a list of potential leads in trades businesses in the US based on given parameters.',
    );

    parser.add_argument(
        '-t',
        '--trade',
        default='plumber',
        choices=['plumber'], # @todo: append this list of choices in the future
        help='What kind of trades professionals are you looking for? You can choose from the following: plumber.'
    ); 

    parser.add_argument(
        '-c',
        '--cities',
        nargs='+',
        default=[],
        required=True,
        help="Provide a city or a space-separated list of cities (US ONLY) where we should look for trade professionals.",
    );

    args = parser.parse_args()
   
    cities = args.cities

    for city in cities:
        if city not in us_cities:
            logger.error('Wrong city provided: \"' + city + '\" is not on our list of US cities.')
            raise ValueError('Wrong city provided: \"' + city + '\" is not on our list of US cities.')

    print('trades type: ', type(args.trade))
    print('cities type: ', type(cities))

    print('Trade: ', args.trade)
    print('Cities list: ', cities)

if __name__ == '__main__':
    main()
