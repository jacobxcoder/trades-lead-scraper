import argparse
import pandas as pd
import requests
from loguru import logger
from bs4 import BeautifulSoup

us_cities_df = pd.read_csv("./us_cities.csv", sep="|")

# columns to scrape / return
columns = ["no", "name", "phone", "email", "city", "state", "country"]

# initialize an output dataframe
output_df = pd.DataFrame(columns=columns)


def get_leads_yelp(trade, city, state, country="USA", max_page=3):
    if country != "USA":
        logger.error(
            "This script is designed to work only in the US (for now). Please provide a valid country."
        )
        raise ValueError(
            "This script is designed to work only in the US (for now). Please provide a valid country."
        )

    url = "https://www.yelp.com/search?find_desc={trade}&find_loc={city}%2C+{state}%2C+{country}".format(
        trade=trade, city=city, state=state, country=country
    )

    page_index = 1

    while url:
        page = requests.get(url)

        if page.status_code != 200:
            logger.error(
                "Failed to fetch the Yelp page. Status code: " + page.status_code
            )

        soup = BeautifulSoup(page.content, "html.parser")
        html_item_cards = soup.select('[data-testid="scrollable-photos-card"]')

        for html_item_card in html_item_cards:
            # scraping logic
            name = html_item_card.select_one("h3 a").text
            url = (
                "https://www.yelp.com" + html_item_card.select_one("h3 a").attrs["href"]
            )

            global output_df
            output_df = pd.concat(
                [
                    output_df,
                    pd.DataFrame(
                        [
                            {
                                "no": output_df.shape[0],
                                "name": name,
                                "phone": "not yet implemented",
                                "email": "not yet implemented",
                                "city": city,
                                "state": state,
                                "country": country,
                            }
                        ]
                    ),
                ],
                ignore_index=True,
            )

        next_link_btn = soup.select_one('a.next-link[aria-label="Next"]')

        if not next_link_btn or page_index > max_page:
            logger.success("Fetched all the pages sucessfully. Ending the process.")
            url = False
            break

        url = next_link_btn.attrs["href"]
        logger.success("Fetched page " + str(page_index) + ". Moving to the next one.")

        page_index += 1


def main():
    logger.info("Initializing the scraper script.")

    parser = argparse.ArgumentParser(
        prog="trades-scraper",
        description="This script scrapes a list of potential leads in trades businesses in the US based on given parameters.",
    )

    parser.add_argument(
        "-t",
        "--trade",
        default="plumbers",
        choices=["plumbers"],  # @todo: append this list of choices in the future
        help="What kind of trades professionals are you looking for? You can choose from the following: plumber.",
    )

    parser.add_argument(
        "-l",
        "--location",
        default=[],
        action="append",
        required=True,
        help='Provide a single location or a space-separated list of locations in "city,short state" format. Only US cities are supported. E.g. Miami,FL New York,NY.',
    )

    args = parser.parse_args()

    # Each city needs to be in form 'city','short state', e.g. Miami,FL
    locations = args.location

    for location in locations:
        # my intuition tells me that there's a cleaner way to write this
        # also, add a try/catch block to this
        _city = location.split(",")[0]
        _state = location.split(",")[1]

        found = us_cities_df[
            (us_cities_df["City"] == _city) & (us_cities_df["State short"] == _state)
        ]

        if found.empty:
            logger.error(
                'Wrong location provided: "'
                + location
                + '" is not on our list of US cities.'
            )
            raise ValueError(
                'Wrong location provided: "'
                + location
                + '" is not on our list of US cities.'
            )

    logger.success("All cities provided are correct.")
    logger.info(
        "Starting to scrape the web for potential leads \n\t- for the trade: "
        + args.trade
        + "\n\t- in the following cities: "
        + ", ".join(locations)
    )

    for location in locations:
        _city = location.split(",")[0]
        _state = location.split(",")[1]
        logger.info(
            "Fetching leads for the trade: "
            + args.trade
            + " in the city: "
            + _city
            + ", "
            + _state
        )
        get_leads_yelp(args.trade, _city, _state)
        output_df.to_csv("result.csv")


if __name__ == "__main__":
    main()
