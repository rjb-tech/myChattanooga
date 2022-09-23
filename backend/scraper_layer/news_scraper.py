#!/usr/bin/env python3

# ************************************************** #
#
# Author: Ryne Burden
#
# Description:
#    - This script gathers daily news from all local Chattanooga news sources
#
#
# ************************************************** #
import os
import re
import time
import pickle
import tweepy
import asyncio
import logging
import requests
import facebook
import sqlalchemy
from typing import Any, Dict, Optional, Tuple, List, NamedTuple
from pytz import timezone
from databases import Database
from sqlite3 import Cursor, Error
from datetime import datetime
from selenium import webdriver
from bs4 import BeautifulSoup as bs
from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from database_module import MC_Connection
from result import Ok, Err, Result

# from sqlalchemy import exists
from sqlalchemy.sql import exists, or_, select


class ArticleEntry(NamedTuple):
    headline: str
    date_posted: str
    publisher: str
    link: Optional[str] = None
    image: Optional[str] = None
    time_posted: Optional[str] = None


# Configure logger
logging.basicConfig(
    filename="myChattanooga.log",
    filemode="a",
    format="%(asctime)s - %(message)s",
    datefmt="%d-%b-%y %H:%M:%S",
    level=logging.INFO,
)

# This dictionary contains all the needed links for scraping
links = {
    "chattanoogan": {
        "base": "https://www.chattanoogan.com",
        "breaking": "/List.aspx?ArticleTypeID=1",
        "happenings": "/List.aspx?ArticleTypeID=4",
        "dining": "/List.aspx?ArticleTypeID=6",
        "business": "/List.aspx?ArticleTypeID=10",
        "school": "/List.aspx?ArticleTypeID=11",
        "entertainment": "/List.aspx?ArticleTypeID=82",
    },
    "fox_chattanooga": {
        "base": "https://foxchattanooga.com",
        "local_news": "/news/local",
        "gas_prices": "/news/area-gas-prices",
    },
    "times_free_press": {
        "base": "https://www.timesfreepress.com",
        "local_news": "/news/local/",
        "region_business": "/news/business/aroundregion/",
        "business_diary": "/news/business/diary/",
        "local_politics": "/news/politics/regional/",
        "dining": "/news/chattanooganow/dining",
        "music": "/news/chattanooganow/music/",
        "out_and_about": "/news/chattanooganow/outabout/",
    },
    "wdef": {"base": "https://wdef.com", "local_news": "/category/local-news/"},
    "nooga_today": {
        "base": "https://noogatoday.6amcity.com",
        "local_news": "/category/news/",
        "city": "/category/cities/",
        "food_drink": "/category/food-drink/",
        "lifestyle": "/category/lifestyle/",
    },
    "chattanooga_pulse": {
        "base": "http://www.chattanoogapulse.com",
        "local_news": "/local-news",
        "city_life": "/citylife",
        "arts": "/arts",
        "music": "/music",
        "food_drink": "/food-drink",
    },
    "chattanooga_news_chronicle": {
        "base": "https://chattnewschronicle.com",
        "top_stories": "/category/top-stories/",
        "community": "/category/community-connection/",
        "health": "/category/health/",
        "featured": "/category/featured/",
    },
    "local_three": {"base": "https://local3news.com", "local_news": "/local-news/"},
    "youtube": {
        "base": "https://youtube.com",
        "cha_guide": "/channel/UCqO3AVi0ZtkL_VcME0C8Acg/videos",
        "scenic_city_records": "/channel/UCg5EeMkT78fG_JK-R0NPmaA/videos",
    },
    "brew_chatt": {
        "base": "http://brewchatt.com",
        "bcpod": "/bcpod",
        "chaos": "/inchaoswetrust",
    },
}

# This list will contain all Chattanooga area towns and sections
# They will be used as keywords for regex searches of the current headline and excerpt
region_keywords = [
    "chattanooga",
    "chatt state",
    " chatt ",
    " utc ",
    "east brainerd",
    "middle valley",
    "harrison",
    "apison",
    "monteagle",
    "hamilton county",
    "hamilton co",
    "signal mountain",
    "lookout mountain",
    "ridgeside",
    "soddy daisy",
    "soddy-daisy",
    "collegedale",
    "ridgeside",
    "tennessee valley",
    "hixson",
    "east ridge",
    "brainerd",
    "red bank",
    "red-bank",
    "ooltewah",
    "tva",
    "epb",
    "erlanger",
    "city council",
    "tennessee american water",
    "tennessee valley authority",
    "jasper",
    "avondale",
    "best and worst restaurant inspection",
    "st. elmo",
    "cpd",
    "north shore",
    "today's weather",
    "lee university",
    "cleveland",
    "suck creek",
    "collegedale",
]

# This list will be used for Chattanooga happenings article filtering
chattanoogan_keywords = [
    "weekly road construction report",
    "mayoral",
    "city council",
    "mayor",
    "food drive",
    "closed",
    "cdot",
    "upcoming street closures",
    "cpd",
    "county commission",
]


keywords_to_avoid = [
    "georgia",
    "alabama",
    "north carolina",
    "jerry summers",
    "life with ferris",
    "fort oglethorpe",
    "dalton",
    "rossville",
    "ringgold",
    "catoosa",
    "biden",
    "kamala",
    "ohio",
    "white house",
    "get emailed headlines from chattanoogan.com",
]


def print_keywords():
    for x in region_keywords:
        print(x + "<br>")


# This function is just an easy way to query the current date
def get_date(format: int) -> str:
    suffixes = {
        "1": "st",
        "2": "nd",
        "3": "rd",
        "4": "th",
        "5": "th",
        "6": "th",
        "7": "th",
        "8": "th",
        "9": "th",
        "10": "th",
        "11": "th",
        "12": "th",
        "13": "th",
        "14": "th",
        "15": "th",
        "16": "th",
        "17": "th",
        "18": "th",
        "19": "th",
        "20": "th",
        "21": "st",
        "22": "nd",
        "23": "rd",
        "24": "th",
        "25": "th",
        "26": "th",
        "27": "th",
        "28": "th",
        "29": "th",
        "30": "th",
        "31": "st",
    }

    today = datetime.now()

    day = today.strftime("%-d")

    # This is used for chattanoogan, channel 9, and wdef articles
    if format == 1:
        return str(today.strftime("%m/%d/%Y"))
    # THis is used for Times Free Press articles
    elif format == 2:
        return str(today.strftime("%B %-d" + suffixes[day] + ", %Y"))
    # This will be used for keeping track of Times Free Press article post times
    elif format == 3:
        return str(today.strftime("%-m-%-d-%Y"))
    # This date format helps with the date check for news channel nine
    elif format == 4:
        return str(today.strftime("%B %-d" + suffixes[day] + " %Y"))
    # This format is used for scraping the pulse
    elif format == 5:
        return str(today.strftime("%b %-d, %Y"))
    elif format == 6:
        return str(today.strftime("%Y-%m-%d"))
    elif format == 7:
        return str(today.strftime("%m-%d-%Y"))
    elif format == 8:
        return str(today.strftime("%B %-d, %Y"))
    # Print just the month
    elif format == 9:
        return str(today.strftime("%B"))
    elif format == 10:
        return today.strftime("%H:%M")
    elif format == 11:
        return today.strftime("%A")
    elif format == 12:
        return today.strftime("%-H:%M")
    return "oops not a correct input"


# This function will add a 0 to the beginning of the published date of a given article
def refine_article_date(date: str) -> str:
    # Test case for single digit month and day values
    if re.search("^\d/\d/\d\d\d\d", date):

        # Perform the match and grab the matching string
        date_match = re.search("^\d/\d/\d\d\d\d", date)
        date_match = date_match.group()

        # Add 0's to the month and day portions of the date
        new_date = "0" + date_match[:2] + "0" + date_match[2:]

    # Test case for single digit month and double digit day
    elif re.search("^\d/\d\d/\d\d\d\d", date):
        date_match = re.search("^\d/\d\d/\d\d\d\d", date)
        date_match = date_match.group()

        # Add 0 to the month portion of the date
        new_date = "0" + date_match

    # Test case for double digit month and single digit date
    elif re.search("^\d\d/\d/\d\d\d\d", date):
        date_match = re.search("^\d\d/\d/\d\d\d\d", date)
        date_match = date_match.group()

        new_date = date_match[:3] + "0" + date_match[3:]

    # Test case for double digit month and day portions of the date. This is a failsafe to avoid extra characters
    elif re.search("^\d\d/\d\d/\d\d\d\d", date):
        date_match = re.search("^\d\d/\d\d/\d\d\d\d", date)
        new_date = date_match.group()

    # Return the new date
    return new_date


# This function will change the time from 12 hour to 24 hour format
def refine_article_time(time: str) -> str:
    # Assign hour, minute, and time_of_day for each possible time configuration
    # 1 digit hour search case
    if re.search("\W\w:\w\w \w\w", time):
        time = re.search("\W\w:\w\w \w\w", time).group()
        hour = "0" + time[1]
        minute = time[3:5]
        time_of_day = time[-2:]

    # 2 digit hour search case
    elif re.search("\w\w:\w\w \w\w", time):
        time = re.search("\w\w:\w\w \w\w", time).group()
        hour = time[:2]
        minute = time[3:6]
        time_of_day = time[-2:]

    # AM if check
    if time_of_day == "AM":

        # Make the hour value 00 when it is 12 AM
        if hour == "12":
            return "00:" + minute
        else:
            return hour + ":" + minute

    # PM if check
    elif time_of_day == "PM":

        if hour != "12":
            # Add 12 to the hour variable for PM times that aren't 12
            return str(int(hour) + 12) + ":" + minute

        else:
            # hour = int(hour) + 1
            return str(hour) + ":" + minute


# This is used for determining posted times for Times Free Press articles
def calculate_time_posted(time_since_posted, hour_or_minute):
    # Load current time into a variable
    now = datetime.now()
    now = str(now.strftime("%H:%M"))
    posted_hour = now[:2]
    posted_minute = now[-2:]

    # If check for articles posted minutes ago
    if hour_or_minute == "minute":

        # The .replace accounts for sub-10 minute intervals (e.g. 4 minutes ago)
        posted_minute = str(
            int(posted_minute) - int(time_since_posted[:2].replace(" ", ""))
        )

        # If the difference of the current and posted minute is negative then take it away from 60
        # and decrement hour
        if int(posted_minute) < 0:
            posted_hour = str(int(posted_hour) - 1)
            posted_minute = str(60 + int(posted_minute))

        # Articles posted on the hour will result in a single 0 for minute since
        # int zeroes are only themselves
        elif int(posted_minute) == 0:
            posted_minute = "00"

        # This if statement checks for single digit hours
        # and adds a 0 in front for continuity with the other scrapers
        if len(posted_hour) == 1:
            return str("0" + posted_hour + ":" + posted_minute)
        else:
            return str(posted_hour + ":" + posted_minute)

    elif hour_or_minute == "hour":

        # Increment posted hour by 1 if current minute is over 30
        if int(posted_minute) > 30:
            posted_hour = str(int(posted_hour) + 1)

        posted_hour = str(
            int(posted_hour) - int(time_since_posted[:2].replace(" ", ""))
        )

        if int(posted_hour) >= 0:

            if len(posted_hour) == 1:
                return str("0" + posted_hour + ":" + "00")
            else:
                return str(posted_hour + ":00")

        else:

            # return "not today" if the posted_hour is negative which would indicate a video from yesterday
            return str("not today")


# This function determines if Times Free Press articles are from today
def is_from_today_tfp(link: str) -> bool:
    # Get the page html and load into a bs object
    article_request = requests.get(link)
    article_soup = bs(article_request.text, "lxml")

    posted_today_indicator = article_soup.find("p", class_="article__date").text

    if re.search("today", posted_today_indicator.lower()):
        return True

    return False


# This function is used to dtermine is an article is relevant by searching
# The region keyword list
def is_relevant_article(headline: str = "", excerpt: str = "") -> bool:
    # Avoid articles that mention chattanooga but are actually about another state/city
    for word in keywords_to_avoid:
        if re.search(word, headline.lower()):
            return False

    for word in region_keywords:

        # Return true if the queued article is relevant
        if re.search(word, headline.lower()) or re.search(word, excerpt.lower()):
            return True

    # Return false if no matches are found
    return False


def is_relevant_chattanoogan(headline: str = "") -> bool:
    # Avoid articles that mention chattanooga but are actually about another state/city
    for word in keywords_to_avoid:
        if re.search(word, headline.lower()):
            return False

    keywords = region_keywords + chattanoogan_keywords

    for word in keywords:
        if re.search(word, headline.lower()):
            return True

    # Return false if no matches are found
    return False


# This function returns a time if it is available for a given story
def search_tfp_times(headline, current_articles):
    # Loop through every story and query based on the supplied headline
    # increment by 2 to always have the current_headline as file_contents[x]
    # the .replace is necessary since the items in the list are separated by newlines
    if len(current_articles) > 2:

        for x in range(0, len(current_articles), 2):

            # Return the time posted if the headline given to the function is in the list
            if re.search(headline.rstrip(), current_articles[x]):
                return current_articles[x + 1]

    elif len(current_articles) == 2:

        if re.search(headline, str(current_articles[0])):
            return current_articles[1]

    # Returns None if the story isn't found
    return None


# This function writes headlines and their posted times to the open file
def write_to_times_file(found_articles: List[ArticleEntry], file_name: str) -> None:
    # Load current articles into a list and make an empty list if the pickle load throw and exception
    try:
        current_tfp_articles = pickle.load(open(file_name, "rb"))
    except:
        current_tfp_articles = []

    # iterate the list backwards to help with popping
    for current in reversed(found_articles):

        # See if the article is already saved
        time_accounted_for = search_tfp_times(
            current.headline.lower().rstrip(), current_tfp_articles
        )

        # Ignore the current story if found
        if time_accounted_for:

            found_articles.pop()

        # Add current story to current_tfp_articles before popping
        else:
            current_tfp_articles.append(current.headline.lower().rstrip())
            current_tfp_articles.append(current.time_posted)

            found_articles.pop()

    pickle.dump(current_tfp_articles, open(file_name, "wb"))


# This will need to be changed to datetime object instead of string
def get_tfp_article_time_posted(link: str) -> str:
    article_request = requests.get(link)
    article_soup = bs(article_request.text, "lxml")

    # Format of time_posted is " 4:33 pm"
    time_posted = (
        article_soup.find("p", class_="article__date")
        .text.strip()[-10:]
        .strip()
        .replace(".", "")
    )
    datetime_obj = datetime.strptime(time_posted, "%I:%M %p")
    date_string_to_return = datetime.strftime(datetime_obj, "%H:%M")

    return date_string_to_return


def get_pulse_article_content(link: str, session: requests.Session) -> str:
    # Make a string to return
    text_to_return = ""

    # Get the article page and make a soup object with it
    # request = requests.get(link)
    current_soup = bs(session.get(link).text, "lxml")

    # Get the article
    current_article_content = current_soup.find("article")

    # Get the first p tag
    current_p_tag = current_article_content.find("p", class_="lead")

    # Find all p tags and append them to text_to_return
    while current_p_tag:
        text_to_return = text_to_return + current_p_tag.text + "\n\n"

        current_p_tag = current_p_tag.find_next_sibling("p")

    # Return the string
    return text_to_return


def get_wdef_article_content(link, session):
    # Make a string to return
    string_to_return = ""

    # Get the article page and make a soup object with it
    # request = requests.get(link)
    current_soup = bs(session.get(link).text, "lxml")

    # Get the article
    current_article_content = current_soup.find("div", class_="basic-content-wrap cf")

    # Get the first p tag
    current_p_tag = current_article_content.find("p")

    # Find all p tags and append them to text to return
    while current_p_tag:
        string_to_return = string_to_return + current_p_tag.text + "\n\n"

        current_p_tag = current_p_tag.find_next("p")

    return string_to_return


def scrape_chattanoogan(
    url: str, date: str, session: requests.Session, category: str = None
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    total_articles_scraped = 0
    publisher = "Chattanoogan"
    chattanoogan_logo = (
        "https://mychattanooga-files.nyc3.digitaloceanspaces.com/chattanoogan_logo.webp"
    )

    # try statement to account for the website being down
    try:

        # Get HTML from the queried page and make it into a soup object
        chattanoogan_soup = bs(session.get(url).text, "lxml")

    except:

        # Return a status indicating the site is down or can't be reached
        return (
            [
                ArticleEntry(
                    headline="DOWN", publisher=publisher, date_posted=get_date(7)
                )
            ],
            None,
        )

    # This variable will hold the content table from chattanoogan.com
    content_section = chattanoogan_soup.find("table", class_="list")

    # Cycle through the first <tr> since it only holds column labels
    current_article = content_section.find("tr")

    # This loop will get the headline, date, and link for each article in the list
    # There are 26 stories on each page
    for story in range(0, 26):

        # Find the next table row, each of the articles is in a row
        current_article = current_article.find_next("tr")

        # Assign the title, href, and date/time to variables
        current_data = current_article.find_next("td")
        current_headline = current_data.text
        current_link = links["chattanoogan"]["base"] + str(current_data.a["href"])
        current_date_time = current_data.find_next(
            "td"
        ).text  # The date here is the first 10 characters of this tag

        # Refine the date and time to be in the correct format
        current_date = refine_article_date(current_date_time[:11])
        current_time = refine_article_time(current_date_time[-8:])

        # Further process the current_article if it is from today
        if current_date == date:

            # Add 1 to total_articles_scraped if an article is found
            total_articles_scraped += 1

            # This block will change time and date strings to datetime objects
            current_date = datetime.strptime(current_date.strip(), "%m/%d/%Y").date()
            current_time = datetime.strptime(current_time.strip(), "%H:%M").strftime(
                "%H:%M"
            )

            # This flags articles as "later" if they have a time from later in the day
            # Chattanoogan needs to get their shit together with scheduling
            if int(get_date(10)[:2]) - int(current_time[:2]) < 0:
                now_or_later = "later"
            else:
                now_or_later = "now"

            # category wil only have a value if set in the function call since it defaults to None
            # I use this only for breaking/political articles
            if category == "b/p":

                # Add to approved articles if the headline has chatt or hamilton county in it
                # This avoids making unecessary requests to the chattanoogan's website
                if is_relevant_article(current_headline) and now_or_later == "now":

                    # Add data to approved articles list
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=chattanoogan_logo,
                            date_posted=get_date(7),
                            time_posted=current_time,
                            publisher=publisher,
                        )
                    )

                else:
                    # Go the the current article and search for chattanooga or hamilton county in the story
                    # add story to temp list and approved articles if it's about chatt or hamilton county
                    if (
                        is_relevant_article(
                            current_headline,
                            bs(session.get(current_link).text, "lxml")
                            .find("div", class_="story")
                            .text,
                        )
                        and now_or_later == "now"
                    ):
                        # Add data to the approved articles list
                        approved_articles.append(
                            ArticleEntry(
                                headline=current_headline,
                                link=current_link,
                                image=chattanoogan_logo,
                                date_posted=get_date(7),
                                time_posted=current_time,
                                publisher=publisher,
                            )
                        )

            # Append to temp_list and approved_articles if the article is for the non-political section
            elif category == "happenings":

                # New function to filter happenings articles
                if is_relevant_chattanoogan(current_headline) and now_or_later == "now":
                    # Add data to approved articles list
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=chattanoogan_logo,
                            date_posted=get_date(7),
                            time_posted=current_time,
                            publisher=publisher,
                        )
                    )

            # This last if statement is for business articles
            else:

                # Check for relevancy
                # Only check headline here to filter out some non relevant stuff
                if is_relevant_article(current_headline) and now_or_later == "now":
                    # Add data to approved articles list
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=chattanoogan_logo,
                            date_posted=get_date(7),
                            time_posted=current_time,
                            publisher=publisher,
                        )
                    )

        elif current_date != date and story > 0:

            # Break out of the loop if date_posted isn't today
            # Since every article from now on will be from another
            break

    return approved_articles, total_articles_scraped


def scrape_fox_chattanooga(
    url: str, date: str
) -> Tuple[List[ArticleEntry], Optional[int]]:

    # Scraper variables
    approved_articles: List[Any] = []
    all_local_stories: List[Any] = []
    total_articles_scraped = 0
    publisher = "Fox Chattanooga"

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    # ---------- COPIED TO RUN_SCRAPER ----------#
    # chrome_options = Options()
    # chrome_options.add_argument('--headless')
    # chrome_options.BinaryLocation = '/usr/bin/chromium-browser'
    # headless_browser = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)

    # Try statement to account for the website being down
    try:

        # set a page load timeout limit
        headless_browser.set_page_load_timeout(30)

        # Open the page and load the source into a soup object
        headless_browser.get(url)

        browser_wait = WebDriverWait(headless_browser, 20).until(
            EC.presence_of_element_located(
                (By.CLASS_NAME, "twoColumn-module_columnOne__179p")
            )
        )

        # Grab the HTML source from the browser and load it into a bs object
        local_news_page_soup = bs(headless_browser.page_source, "lxml")

        # This variable holds the section with all the local news articles on channel 9
        # It will be used for searching in the for loop below to get links for each actual local story
        # content_section = local_news_page_soup.find('div', class_ = 'index-module_leftInner__Qolw')
        content_section = local_news_page_soup.find(
            "div", class_="twoColumn-module_columnOne__179p"
        )

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()

        # quit the browser and return a list to indicate the website is down or can't be reached
        headless_browser.quit()

        return (
            [
                ArticleEntry(
                    headline="DOWN", publisher=publisher, date_posted=get_date(7)
                )
            ],
            None,
        )

    # Priming read before the main scraping loop
    # The a tags hold most of the info needed
    current_article = content_section.find("div", class_="index-module_teaser__2qaT")
    current_headline = current_article.find("a")["alt"]
    current_link = current_article.find("a")["href"]

    # Find the image div for the premiere article on news channel nine local news
    # The alt for these images follows a scheme everytime
    current_image_div = current_article.find(
        "div", alt=f"Image for story: {current_headline}"
    )

    # This extracts the image link used for the article
    # The replace takes out the parenthetical casing in the style tag
    # The split puts all elements of the style tag into a list, where the url is at index 1
    current_image_link = (
        current_image_div["style"].replace('url("', "").replace('");', "").split()[1]
    )

    # Add all needed info to temp_list if the story is from news/local or news/coronavirus
    if is_relevant_article(current_headline):
        # add data to all_local_stories
        all_local_stories.append(
            {
                "headline": current_headline,
                "link": f"https://foxchattanooga.com{current_link}",
                "image": f"https://foxchattanooga.com{current_image_link}",
            }
        )

    # This loop scrapes every story on the main local news page
    for story in range(0, 16):

        # The a tags hold most of the info needed
        current_article = current_article.find_next(
            "div", class_="index-module_teaser__2qaT"
        )
        current_headline = current_article.find("a")["alt"]
        current_link = current_article.find("a")["href"]

        # Find the image div for the premiere article on news channel nine local news
        # The alt for these images follows the same scheme
        current_image_div = current_article.find(
            "div", alt=f"Image for story: {current_headline}"
        )

        # This extracts the image link used for the article
        # The replace takes out the parenthetical casing in the style tag
        # The split puts all elements of the style tag into a list, where the url is at index 1
        current_image_link = (
            current_image_div["style"]
            .replace('url("', "")
            .replace('");', "")
            .split()[1]
        )

        # If check to only append info from news/local and news/coronavirus
        if is_relevant_article(current_headline):
            # Add data to all_local_stories
            all_local_stories.append(
                {
                    "headline": current_headline,
                    "link": f"https://foxchattanooga.com{current_link}",
                    "image": f"https://foxchattanooga.com{current_image_link}",
                }
            )

    # This loop will only pass stories that are about chattanooga and hamilton county
    # To the approved_local_stories list
    for story in all_local_stories:

        try:

            # Make a bs object for the current story
            headless_browser.get(story["link"])
            time.sleep(3)

        # This accounts for the dictionary not having any key: value pairs
        except KeyError:

            continue

        # Wait for page to load
        headless_browser.implicitly_wait(5)

        current_article_page_soup = bs(headless_browser.page_source, "lxml")

        # Find dateline and time, on these pages it usually shows what town the news is from
        # I'm deleting the last 2 characters of each dateline because they are useless
        # lower() is used to make searching more effective
        current_dateline = current_article_page_soup.find("span", class_="dateline")

        # Set the current headline variable to help in classifying articles below
        current_headline = story["headline"]

        current_datetime = current_article_page_soup.find("time")["datetime"]

        # Change date into EST
        current_datetime = current_datetime.replace("T", " ")
        current_datetime = current_datetime[:-5]
        current_datetime = datetime.strptime(current_datetime, "%Y-%m-%d %H:%M:%S")
        current_datetime = current_datetime.replace(tzinfo=timezone("UTC"))
        current_datetime = current_datetime.astimezone(timezone("US/Eastern"))

        current_time_posted = str(current_datetime)[11:16]
        current_date_posted = str(current_datetime)[:10]

        # Append all data to the temp list and append that to list_to_return if
        # The story is about Chattanooga or Hamilton County
        if current_dateline != None:

            # I changed this to use the text from the <time> tag
            # because sometimes that doesn't match the posted date
            # The date here is get_date(3)
            # (e.g. December 9 2020)
            if current_date_posted == date:

                total_articles_scraped += 1

                if is_relevant_article(current_headline, current_dateline.text):

                    approved_articles.append(
                        ArticleEntry(
                            headline=story["headline"],
                            link=story["link"],
                            image=story["image"],
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )

                else:

                    # Break out of the loop if an article isn't from today
                    break

        else:

            # I changed this to use the text from the <time> tag
            # because sometimes that doesn't match the posted date
            # The date here is get_date(3)
            # (e.g. December 9 2020)
            if current_date_posted == date:

                total_articles_scraped += 1

                if is_relevant_article(current_headline):

                    approved_articles.append(
                        ArticleEntry(
                            headline=story["headline"],
                            link=story["link"],
                            image=story["image"],
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )
                else:

                    # Break out of the loop if an article isn't from today
                    break

    # Delete cookies before quitting the browser
    headless_browser.delete_all_cookies()

    # Quit the browser
    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_wdef(
    url: str, date: str, session: requests.Session
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    total_articles_scraped = 0
    publisher = "WDEF News 12"

    try:

        # wdef_request = requests.get(url)
        wdef_soup = bs(session.get(url).text, "lxml")

    except:

        # Return a list indicating that website is down or can't be reached
        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7)),
        ], None

    # Main content section
    # Multiple finds are needed given how wdef has their website set up
    content_section = wdef_soup.find(
        "div", class_="loop-wrapper articles main-loop-wrapper"
    )

    # While loop priming read
    current_article = content_section.find("article", class_="post")
    current_headline = current_article.find("h3").find("a").text
    current_link = current_article.find("h3").find("a")["href"]
    current_article_body = get_wdef_article_content(current_link, session)
    current_image_link = current_article.find("img")["src"]
    current_date_posted = current_article.find("time", class_="entry-time").text
    current_time_posted = get_date(10)

    # Append if the article was posted today
    if current_date_posted == date:

        total_articles_scraped += 1

        # Append article to temp list and approved articles if the news is from chattanooga
        if is_relevant_article(current_headline):

            approved_articles.append(
                ArticleEntry(
                    headline=current_headline,
                    link=current_link,
                    image=current_image_link,
                    date_posted=get_date(7),
                    time_posted=current_time_posted,
                    publisher=publisher,
                )
            )

        # Sometimes articles are tagged chattanooga in the actual article but not the td-excerpt
        # This won't be picked up by the first if, therefore this else statement is needed
        else:
            current_page_soup = bs(session.get(current_link).text, "lxml")

            # if is_relevant_article(current_article_body):

            #     # Append to approved_articles
            #     approved_articles.append({'headline': current_headline,
            #                               'link': current_link,
            #                               'image': current_image_link,
            #                               'date_posted': get_date(7),
            #                               'time_posted': current_time_posted,
            #                               'publisher': publisher})

    # Main scraping loop
    # It will terminate when no stories are left
    for x in range(0, 11):

        # Gather data
        current_article = current_article.find_next("article", class_="post")
        current_headline = current_article.find("h3").find("a").text
        current_link = current_article.find("h3").find("a")["href"]
        current_article_body = get_wdef_article_content(current_link, session)
        current_image_link = current_article.find("img")["src"]
        current_date_posted = current_article.find("time", class_="entry-time").text
        current_time_posted = get_date(10)

        # Append if the article was posted today
        if current_date_posted == date:

            total_articles_scraped += 1

            if is_relevant_article(current_headline):

                approved_articles.append(
                    ArticleEntry(
                        headline=current_headline,
                        link=current_link,
                        image=current_image_link,
                        date_posted=get_date(7),
                        time_posted=current_time_posted,
                        publisher=publisher,
                    )
                )

            # Sometimes articles are tagged chattanooga in the actual article but not the td-excerpt
            # This won't be picked up by the first if, therefore this else statement is needed
            else:

                if is_relevant_article(current_article_body):
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=current_image_link,
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )

        else:

            # Break out of the loop if an article from another day is found
            return approved_articles, total_articles_scraped

    return approved_articles, total_articles_scraped


def scrape_times_free_press(
    url: str, date: str, session: requests.Session
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    total_articles_scraped = 0
    current_time_posted = None
    publisher = "Times Free Press"
    extra_session = requests.Session()

    try:

        # Get the page request and make a bs object with it
        # times_request = requests.get(url)
        times_soup = bs(session.get(url).text, "lxml")

    except:

        # Return a list indicating that site can't be reached
        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7)),
        ], None

    # Main content section
    content_section = times_soup.find("ul", class_="archive__list | card-list")

    # Priming read for scraping loop
    current_article = content_section.find("article", "card")
    current_headline = current_article.find("h3", "card__title").a.text.rstrip()
    current_excerpt = current_article.find("p", "card__tease").text.lower()
    current_link = current_article.find("a", "card__link")["href"]
    current_image_link = current_article.find("img", class_="card__thumbnail")["src"]

    while current_article:

        if is_from_today_tfp(links["times_free_press"]["base"] + current_link):

            total_articles_scraped += 1

            # Append all information to approved_articles if the article is about chattanooga and from today
            if is_relevant_article(current_headline, current_excerpt):

                current_time_posted = get_tfp_article_time_posted(
                    links["times_free_press"]["base"] + current_link
                )

                approved_articles.append(
                    ArticleEntry(
                        headline=current_headline,
                        link=links["times_free_press"]["base"] + current_link,
                        image=current_image_link,
                        date_posted=get_date(7),
                        time_posted=current_time_posted,
                        publisher=publisher,
                    )
                )

            # Break out of the loop if an article not from today is found
            # Every article after that will be from another day, so this improved speed
            else:
                break

        # Gather data
        current_article = current_article.find_next("article", "card")

        # This if check is needed to not fail out when no articles are left
        # GO HERE NEXT
        if current_article:
            current_headline = current_article.find("h3", "card__title").a.text.rstrip()
            current_excerpt = current_article.find("p", "card__tease").text.lower()
            current_link = current_article.find("a", "card__link")["href"]
            current_image_link = current_article.find("img", class_="card__thumbnail")[
                "src"
            ]

    return approved_articles, total_articles_scraped


def scrape_nooga_today_breaking_political(
    url: str, date: str, category: str
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    publisher = "Nooga Today"
    total_articles_scraped = 0

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    # New code to work on the raspberry pi
    # chrome_options = Options()
    # chrome_options.add_argument('--headless')
    # chrome_options.BinaryLocation = '/usr/bin/chromium-browser'
    # headless_browser = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)

    try:

        # Open the page and load the source into a soup object
        headless_browser.get(url)

        browser_wait = WebDriverWait(headless_browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alm-reveal"))
        )

        nooga_soup = bs(headless_browser.page_source, "lxml")

    except:

        headless_browser.quit()

        # return a list with a dict inside indicating the website is down or unable to be reached
        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7)),
        ], None

    # Isolate the content section and get the first article listed
    content_section = nooga_soup.find("div", class_="alm-reveal")
    current_article = content_section.find("article")

    # Priming read for the main scraping loop
    current_headline = current_article.find("h2", class_="entry-title").text
    # current_excerpt = current_article.find('div', class_ = 'entry-excerpt').p.text.lower()
    current_link = current_article.find("h2", class_="entry-title").a["href"]
    try:
        current_image_link = current_article.find("img")["src"]
    except:
        current_image_link = (
            "https://mychattanooga-files.nyc3.digitaloceanspaces.com/nooga_today.png"
        )
    current_date_posted = current_article.find("time")["datetime"][:10]
    current_time_posted = current_article.find("time")["datetime"][11:16]
    current_category = (
        current_article.find("span", class_="category").text.lower().strip()
    )

    # Reformat date
    # current_year = current_date_posted[:4]
    # current_month = current_date_posted[5:7]
    # current_day = current_date_posted[8:10]
    current_date_posted = (
        current_date_posted[5:7]
        + "/"
        + current_date_posted[8:10]
        + "/"
        + current_date_posted[:4]
    )

    # Check if the current article is from today
    if current_date_posted == date:

        total_articles_scraped += 1

        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(current_date_posted, "%m/%d/%Y").date()
        current_time_posted = datetime.strptime(
            current_time_posted.strip(), "%H:%M"
        ).strftime("%H:%M")

        # Append the current article if it is a single category post
        if re.search(",", current_category) == None and current_category == category:

            approved_articles.append(
                ArticleEntry(
                    headline=current_headline,
                    link=current_link,
                    image=current_image_link,
                    date_posted=get_date(7),
                    time_posted=current_time_posted,
                    publisher=publisher,
                )
            )

        # For the breaking/political scraper, the city category will sometimes have multiple tags
        # I only want the city, news articles if they are from multiple categories
        # The other multiple category posts will be picked up by the other scraper
        elif re.search(",", current_category):
            if category == "news":
                if re.search("city, news", current_category) or re.search(
                    "lifestyle, news", current_category
                ):
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=current_image_link,
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )
    else:

        # Return approved articles to break the function call if the first article isn't from today
        return approved_articles, total_articles_scraped

    for story in range(4):

        # Move to the next article on the page and gather info
        current_article = current_article.find_next("article")
        current_headline = current_article.find("h2", class_="entry-title").text
        # current_excerpt = current_article.find('div', class_='entry-excerpt').p.text.lower()
        current_link = current_article.find("h2", class_="entry-title").a["href"]
        try:
            current_image_link = current_article.find("img")["src"]
        except:
            current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/nooga_today.png"
        current_date_posted = current_article.find("time")["datetime"][:10]
        current_time_posted = current_article.find("time")["datetime"][11:16]
        current_category = (
            current_article.find("span", class_="category").text.lower().strip()
        )

        # Reformat date
        # current_year = current_date_posted[:4]
        # current_month = current_date_posted[5:7]
        # current_day = current_date_posted[8:10]
        current_date_posted = (
            current_date_posted[5:7]
            + "/"
            + current_date_posted[8:10]
            + "/"
            + current_date_posted[:4]
        )

        # Check if the current article is from today
        if current_date_posted == date:

            total_articles_scraped += 1

            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(
                current_date_posted.strip(), "%m/%d/%Y"
            ).date()
            current_time_posted = datetime.strptime(
                current_time_posted.strip(), "%H:%M"
            ).strftime("%H:%M")

            # Append the current article if it is a single category post
            if (
                re.search(",", current_category) == None
                and current_category == category
            ):

                approved_articles.append(
                    ArticleEntry(
                        headline=current_headline,
                        link=current_link,
                        image=current_image_link,
                        date_posted=get_date(7),
                        time_posted=current_time_posted,
                        publisher=publisher,
                    )
                )

            # For the breaking/political scraper, the city category will sometimes have multiple tags
            # I only want the city, news articles if they are from multiple categories
            # The other multiple category posts will be picked up by the other scraper
            elif re.search(",", current_category.lower()):
                if category == "city":
                    if re.search("city, news", current_category) or re.search(
                        "lifestyle, news", current_category
                    ):
                        approved_articles.append(
                            ArticleEntry(
                                headline=current_headline,
                                link=current_link,
                                image=current_image_link,
                                date_posted=get_date(7),
                                time_posted=current_time_posted,
                                publisher=publisher,
                            )
                        )

        else:

            # Break if an article from another day is found
            break

    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_nooga_today_non_political(
    url: str, date: str, category: str
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    publisher = "Nooga Today"
    total_articles_scraped = 0

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    # New code to work on the raspberry pi
    # chrome_options = Options()
    # chrome_options.add_argument('--headless')
    # chrome_options.BinaryLocation = '/usr/bin/chromium-browser'
    # headless_browser = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)

    try:

        # Open the page and load the source into a soup object
        headless_browser.get(url)

        browser_wait = WebDriverWait(headless_browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, "alm-reveal"))
        )

        nooga_soup = bs(headless_browser.page_source, "lxml")

    except:

        headless_browser.quit()

        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7)),
        ], None

    # Isolate the content section and get the first article listed
    content_section = nooga_soup.find("div", class_="alm-reveal")
    current_article = content_section.find("article")

    # Priming read for the main scraping loop
    current_headline = current_article.find("h2", class_="entry-title").text
    # current_excerpt = current_article.find('div', class_ = 'entry-excerpt').p.text.lower()
    current_link = current_article.find("h2", class_="entry-title").a["href"]
    try:
        current_image_link = current_article.find("img")["src"]
    except:
        current_image_link = (
            "https://mychattanooga-files.nyc3.digitaloceanspaces.com/nooga_today.png"
        )
    current_date_posted = current_article.find("time")["datetime"][:10]
    current_time_posted = current_article.find("time")["datetime"][11:16]
    current_category = (
        current_article.find("span", class_="category").text.lower().strip()
    )

    # Reformat date
    # current_year = current_date_posted[:4]
    # current_month = current_date_posted[5:7]
    # current_day = current_date_posted[8:10]
    current_date_posted = (
        current_date_posted[5:7]
        + "/"
        + current_date_posted[8:10]
        + "/"
        + current_date_posted[:4]
    )

    # Add the current article to the temp list if it is from today
    if current_date_posted == date:

        if current_category != "city, news" and current_category != "lifestyle, news":
            total_articles_scraped += 1

        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(
            current_date_posted.strip(), "%m/%d/%Y"
        ).date()
        current_time_posted = datetime.strptime(
            current_time_posted.strip(), "%H:%M"
        ).strftime("%H:%M")

        # Only append the article from the city page if it is only tagged as a city article
        # ----- START HERE -----
        # I need some way to differentiate between category types and where to post dual category stories
        if (
            re.search(",", current_category.lower()) == None
            and current_category == category
        ):

            approved_articles.append(
                ArticleEntry(
                    headline=current_headline,
                    link=current_link,
                    image=current_image_link,
                    date_posted=get_date(7),
                    time_posted=current_time_posted,
                    publisher=publisher,
                )
            )

        # This elif will deal with multiple category posts
        # Priority for story categories is news > city > lifestyle > food and drink
        elif re.search(",", current_category.lower()):
            # This non-political and breaking news scraper will only be used for city, food/drink, and lifestyle sections
            if category == "city":
                # if-else statements for nested categories (city, news \ city, lifestyle \ etc.
                if re.search("city, news", current_category.lower()) == None:
                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=current_image_link,
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )

            elif category == "food + drink":

                if re.search("food + drink, news", current_category.lower()):

                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=current_image_link,
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )

                elif re.search("food + drink, lifestyle", current_category.lower()):

                    approved_articles.append(
                        ArticleEntry(
                            headline=current_headline,
                            link=current_link,
                            image=current_image_link,
                            date_posted=get_date(7),
                            time_posted=current_time_posted,
                            publisher=publisher,
                        )
                    )

    else:

        # Return approved articles and end the function call if article is from another day
        return approved_articles, total_articles_scraped

    for story in range(4):

        # Move to the next article on the page and gather info
        current_article = current_article.find_next("article")
        current_headline = current_article.find("h2", class_="entry-title").text
        # current_excerpt = current_article.find('div', class_='entry-excerpt').p.text.lower()
        current_link = current_article.find("h2", class_="entry-title").a["href"]
        try:
            current_image_link = current_article.find("img")["src"]
        except:
            current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/nooga_today.png"
        current_date_posted = current_article.find("time")["datetime"][:10]
        current_time_posted = current_article.find("time")["datetime"][11:16]
        current_category = (
            current_article.find("span", class_="category").text.lower().strip()
        )

        # Reformat date
        # current_year = current_date_posted[:4]
        # current_month = current_date_posted[5:7]
        # current_day = current_date_posted[8:10]
        current_date_posted = (
            current_date_posted[5:7]
            + "/"
            + current_date_posted[8:10]
            + "/"
            + current_date_posted[:4]
        )

        # Add the current article to the temp list if it is from today
        if current_date_posted == date:

            if (
                current_category != "city, news"
                and current_category != "lifestyle, news"
            ):
                total_articles_scraped += 1

            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(
                current_date_posted.strip(), "%m/%d/%Y"
            ).date()
            current_time_posted = datetime.strptime(
                current_time_posted.strip(), "%H:%M"
            ).strftime("%H:%M")

            # Only append the article from the city page if it is only tagged as a city article
            # ----- START HERE -----
            # I need some way to differentiate between category types and where to post dual category stories
            if (
                re.search(",", current_category.lower()) == None
                and current_category == category
            ):

                approved_articles.append(
                    ArticleEntry(
                        headline=current_headline,
                        link=current_link,
                        image=current_image_link,
                        date_posted=get_date(7),
                        time_posted=current_time_posted,
                        publisher=publisher,
                    )
                )

            # This elif will deal with multiple category posts
            # Priority for story categories is news > city > lifestyle > food and drink
            elif re.search(",", current_category.lower()):
                # This non-political and breaking news scraper will only be used for city, food/drink, and lifestyle sections
                if category == "city":
                    # if-else statements for nested categories (city, news \ city, lifestyle \ etc.
                    if re.search("city, news", current_category.lower()) == None:
                        approved_articles.append(
                            ArticleEntry(
                                headline=current_headline,
                                link=current_link,
                                image=current_image_link,
                                date_posted=get_date(7),
                                time_posted=current_time_posted,
                                publisher=publisher,
                            )
                        )

                elif category == "food + drink":

                    if re.search("food + drink, news", current_category.lower()):

                        approved_articles.append(
                            ArticleEntry(
                                headline=current_headline,
                                link=current_link,
                                image=current_image_link,
                                date_posted=get_date(7),
                                time_posted=current_time_posted,
                                publisher=publisher,
                            )
                        )

                    elif re.search("food + drink, lifestyle", current_category.lower()):

                        approved_articles.append(
                            ArticleEntry(
                                headline=current_headline,
                                link=current_link,
                                image=current_image_link,
                                date_posted=get_date(7),
                                time_posted=current_time_posted,
                                publisher=publisher,
                            )
                        )

        else:

            # Break the loop if the article isn't from today
            break

    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_pulse(
    url: str, date: str, session: requests.Session
) -> Tuple[List[ArticleEntry], Optional[int]]:
    # Scraper variables
    approved_articles = []
    publisher = "Chattanooga Pulse"
    total_articles_scraped = 0

    try:

        # Get the HTML for the specified page and put it into a soup object
        pulse_soup = bs(session.get(url).text, "lxml")

    except:

        # Return a list indicating the website wasn't able to be reached
        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7))
        ], None

    # The pulse pages has a main article that appears differently than the normal articles
    content_section = pulse_soup.find("div", id="main")
    current_article = content_section.find("div", id="sectionlead")

    # Get relevant information from the current article
    current_headline = current_article.find("h2").text
    current_link = current_article.find("h2").find("a")["href"]
    current_article_content = get_pulse_article_content(current_link, session)
    current_image_link = (
        current_article.find("div", class_="image").find("a").find("img")["src"]
    )
    # current_date_posted is not shown on the lead article and a new bs object needs to be made to find it
    # This will be different in the main scraping article b/c all the feature articles have a <time> tag
    current_datetime = session.get(current_link)
    current_datetime = bs(current_datetime.text, "lxml")
    current_datetime = current_datetime.find("time")["datetime"]
    current_date_posted = current_datetime[:10]
    current_time_posted = current_datetime[11:16]

    # Reformat date
    # current_year = current_date_posted[:4]
    # current_month = current_date_posted[5:7]
    # current_day = current_date_posted[8:10]
    current_date_posted = (
        current_date_posted[5:7]
        + "/"
        + current_date_posted[8:10]
        + "/"
        + current_date_posted[:4]
    )
    # Append all info to temp list, and temp list to approved_articles if the article is from today and relevant
    if current_date_posted == date:

        total_articles_scraped += 1

        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(
            current_date_posted.strip(), "%m/%d/%Y"
        ).date()
        current_time_posted = datetime.strptime(
            current_time_posted.strip(), "%H:%M"
        ).strftime("%H:%M")

        if is_relevant_article(current_headline, current_article_content):

            approved_articles.append(
                ArticleEntry(
                    headline=current_headline,
                    link=current_link,
                    image=current_image_link,
                    date_posted=get_date(7),
                    time_posted=current_time_posted,
                    publisher=publisher,
                )
            )

    else:

        # return approved_articles if the first articles isn't from today
        return approved_articles, total_articles_scraped

    # There are 6 articles after the lead, so the loop needs to be in range 6
    for x in range(6):

        # Get relevant information
        current_article = current_article.find_next("div", class_="feature")
        current_headline = current_article.find("h3").text
        current_link = current_article.find("h3").find("a")["href"]
        current_article_content = get_pulse_article_content(current_link, session)
        current_image_link = (
            current_article.find("div", class_="image").find("a").find("img")["src"]
        )
        current_datetime = current_article.find("time")["datetime"]
        current_date_posted = current_datetime[:10]
        current_time_posted = current_datetime[11:16]

        # Reformat date
        current_date_posted = (
            current_date_posted[5:7]
            + "/"
            + current_date_posted[8:10]
            + "/"
            + current_date_posted[:4]
        )

        if current_date_posted == date:

            total_articles_scraped += 1

            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(
                current_date_posted.strip(), "%m/%d/%Y"
            ).date()
            current_time_posted = datetime.strptime(
                current_time_posted.strip(), "%H:%M"
            ).strftime("%H:%M")

            if is_relevant_article(current_headline, current_article_content):
                approved_articles.append(
                    ArticleEntry(
                        headline=current_headline,
                        link=current_link,
                        image=current_image_link,
                        date_posted=get_date(7),
                        time_posted=current_time_posted,
                        publisher=publisher,
                    )
                )

        else:

            # break the loop if the current article is not from today
            break

    return approved_articles, total_articles_scraped


def scrape_chattanooga_news_chronicle(url, date):
    # Create a list to return
    approved_articles = list()

    # Publisher to return
    publisher = "Chattanooga News Chronicle"

    # Variable for news analytics
    total_articles_scraped = 0

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    try:
        # Open the page and load the source into a soup object
        headless_browser.get(url)

        chronicle_soup = bs(headless_browser.page_source, "lxml")
        content_section = chronicle_soup.find("div", class_="article-container")

    except:

        headless_browser.quit()

        return [
            {"headline": "DOWN", "publisher": publisher, "date_posted": get_date(7)}
        ], None

    # Isolate the content section and get the first article listed
    current_article = content_section.find("article")

    # Priming read for the main scraping loop
    current_headline = current_article.find("h2", class_="entry-title").text.strip()
    try:
        current_excerpt = (
            current_article.find("div", class_="entry-content").p.text.lower().strip()
        )
    except:
        current_excerpt = ""
    current_link = current_article.find("h2", class_="entry-title").a["href"]
    try:
        current_image_link = current_article.find("img")["src"]
    except:
        current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/news_chronicle_logo.jpeg"
    current_datetime = current_article.find("time", class_="published")["datetime"]
    current_date_posted = current_datetime[:10].strip()
    current_time_posted = current_datetime[11:16]

    if int(get_date(10)[:2]) - int(current_time_posted[:2]) < 0:
        now_or_later = "later"
    else:
        now_or_later = "now"

    while current_article:

        # for the main scraping loop
        if current_date_posted.strip() == date:

            total_articles_scraped += 1

            if (
                is_relevant_article(current_headline, current_excerpt)
                and now_or_later == "now"
            ):
                # Append to approved_articles
                approved_articles.append(
                    {
                        "headline": current_headline,
                        "link": current_link,
                        "image": current_image_link,
                        "date_posted": get_date(7),
                        "time_posted": current_time_posted,
                        "publisher": publisher,
                    }
                )

        else:
            # Break the loop if an article found is not from today
            return approved_articles, total_articles_scraped

        # Isolate the content section and get the first article listed
        current_article = current_article.find_next("article")

        if current_article:
            # Priming read for the main scraping loop
            current_headline = current_article.find(
                "h2", class_="entry-title"
            ).text.strip()
            try:
                current_excerpt = current_article.find(
                    "div", class_="entry-content"
                ).p.text.lower()
            except:
                current_excerpt = ""
            current_link = current_article.find("h2", class_="entry-title").a["href"]
            try:
                current_image_link = current_article.find("img")["src"]
            except:
                current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/news_chronicle_logo.jpeg"
            current_datetime = current_article.find("time", class_="published")[
                "datetime"
            ]
            current_date_posted = current_datetime[:10]
            current_time_posted = current_datetime[11:16]

            if int(get_date(10)[:2]) - int(current_time_posted[:2]) < 0:
                now_or_later = "later"
            else:
                now_or_later = "now"

            # Reformat date
            # current_year = current_date_posted[:4]
            # current_month = current_date_posted[5:7]
            # current_day = current_date_posted[8:10]
            # current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_local_three(url: str, date: str) -> Tuple[List[ArticleEntry], Optional[int]]:
    def is_meteorologist(current_author):
        meteorologists = ["alison pryor", "david karnes", "cedric haynes", "clay smith"]
        mapped_list = map(lambda x: current_author in x, meteorologists)
        return sum(mapped_list) > 0

    # Scraper variables
    approved_articles = []
    all_local_articles = []
    publisher = "Local 3 News"
    total_articles_scraped = 0

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    try:

        # Get the HTML for the specified page and put it into a soup object
        # set a page load timeout limit
        headless_browser.set_page_load_timeout(10)
        headless_browser.get(url)
        time.sleep(4)
        local_three_soup = bs(headless_browser.page_source, "lxml")
        content_section = local_three_soup.find("div", class_="row row-primary")
        current_section = content_section.find_next(
            "div", id="tncms-region-index-primary-b"
        )

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()

        headless_browser.quit()

        # Return a list indicating the website wasn't able to be reached
        return [
            ArticleEntry(headline="DOWN", publisher=publisher, date_posted=get_date(7)),
        ], None

    # This assignment just makes the first line of the for loop work
    # Otherwise current_article.find_next wouldn't work
    current_article = current_section

    # Get the link to the current card and use the requests session to go there and evaluate
    current_article = current_article.find_next(
        "article", class_="tnt-asset-type-article"
    )
    current_headline = current_article.find(
        "div", class_="card-headline"
    ).a.text.strip()
    current_article_category = current_article.find("div", class_="card-label-section")
    if current_article_category:
        current_article_category = current_article_category.a.text.strip().lower()
    current_link = (
        links["local_three"]["base"]
        + current_article.find("a", class_="tnt-asset-link")["href"]
    )
    current_datetime = current_article.find("time", class_="tnt-date")["datetime"]
    current_date_posted = current_datetime[:10]
    current_time_posted = current_datetime[11:16]
    # The image srcset has a ton of different sizes, so let's grab the link to the biggest and see if that scales right
    try:
        current_image_link = current_article.find("img")["srcset"].split()[-2]
    except:
        # saving this just in case
        # current_image_link = "https://pbs.twimg.com/profile_banners/25735151/1642103542/1500x500"
        current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/local_three_logo.jpeg"

    # Reformat date
    current_date_posted = (
        current_date_posted[5:7]
        + "/"
        + current_date_posted[8:10]
        + "/"
        + current_date_posted[:4]
    )

    # Main scraping loop
    # Their story posting pattern is weird, but the first 7 or 8 are usually recent
    while current_article:

        # if current_date_posted == date and current_article_category == 'local news':
        if current_date_posted == date:  # TESTING HERE

            total_articles_scraped += 1

            all_local_articles.append(
                ArticleEntry(
                    headline=current_headline,
                    link=current_link,
                    image=current_image_link,
                    date_posted=get_date(7),
                    time_posted=current_time_posted,
                    publisher=publisher,
                )
            )

        else:
            break

        # Get the link to the current card and use the requests session to go there and evaluate
        current_article = current_article.find_next(
            "article", class_="tnt-section-local-news"
        )
        if current_article:
            current_headline = current_article.find(
                "div", class_="card-headline"
            ).a.text.strip()
            current_article_category = current_article.find(
                "div", class_="card-label-section"
            )
            if current_article_category:
                current_article_category = (
                    current_article_category.a.text.strip().lower()
                )
            current_link = (
                links["local_three"]["base"]
                + current_article.find("a", class_="tnt-asset-link")["href"]
            )
            # Break scraping loop when a story without a datetime is found
            try:
                current_datetime = current_article.find("time", class_="tnt-date")[
                    "datetime"
                ]
            except TypeError:
                break
            current_date_posted = current_datetime[:10]
            current_time_posted = current_datetime[11:16]
            # The image srcset has a ton of different sizes, so let's grab the link to the biggest and see if that scales right
            try:
                current_image_link = current_article.find("img")["srcset"].split()[-2]
            except:
                # saving this just in case
                # current_image_link = "https://pbs.twimg.com/profile_banners/25735151/1642103542/1500x500"
                current_image_link = "https://mychattanooga-files.nyc3.digitaloceanspaces.com/local_three_logo.jpeg"

            # Reformat date
            current_date_posted = (
                current_date_posted[5:7]
                + "/"
                + current_date_posted[8:10]
                + "/"
                + current_date_posted[:4]
            )

    for article in all_local_articles:

        headless_browser.get(article.link)
        time.sleep(5)
        current_article_soup = bs(headless_browser.page_source, "lxml")
        try:
            article_content = current_article_soup.find(
                "div", itemprop="articleBody"
            ).text
        except AttributeError:
            try:
                article_content = current_article_soup.find(
                    "div", class_="asset-content"
                ).text
                logging.info("Used asset-content div for text")
                logging.error(f"No article body for - {article.headline} - ")
            except AttributeError:
                logging.info(f"article content blank for {article.headline}")
                article_content = ""

        if is_relevant_article(article.headline, article_content):

            approved_articles.append(article)

        # This accounts for weather articles that don't explicitly mention chattanooga, but they're about the region
        else:

            try:
                current_author = (
                    current_article_soup.find("span", itemprop="author")
                    .text.strip()
                    .lower()
                )
                if is_meteorologist(current_author):
                    approved_articles.append(article)
            except:
                continue

    # Delete cookies before quitting the browser
    headless_browser.delete_all_cookies()

    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_youtube(url, date):
    # List for approved articles and a temp list for scraping
    approved_articles = list()

    # Publisher variable
    if re.search(links["youtube"]["cha_guide"], url):
        publisher = "CHA Guide"
    elif re.search(links["youtube"]["scenic_city_records"], url):
        publisher = "Scenic City Records"

    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    try:
        # Load the profile page for CHA Guide
        headless_browser.get(url)
        time.sleep(10)
        content_section = bs(headless_browser.page_source, "lxml")
        content_section = content_section.find(
            "div", {"id": "items", "class": "style-scope ytd-grid-renderer"}
        )

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()

        headless_browser.quit()

        return [
            {"headline": " DOWN", "publisher": publisher, "date_posted": get_date(7)}
        ]

    # Priming read for the scraping loop
    current_video = content_section.find_next("ytd-grid-video-renderer")
    if current_video:
        current_video_title = current_video.find("h3").a.text
        current_link = (
            links["youtube"]["base"] + current_video.find("a", id="thumbnail")["href"]
        )
        current_image_link = current_video.find("img", id="img")["src"]
        current_metadata = current_video.find("div", id="metadata-line")
        # The two metadata spans have the same class names, so two find_next statements are used here
        current_time_since_posted = (
            current_metadata.find_next("span").find_next("span").text
        )
        # Find hour or minute in current_time_since_posted
        if re.search("hour", current_time_since_posted):
            hour_or_minute = re.search("hour", current_time_since_posted).group()

            # Calculate current_time_posted
            current_time_posted = calculate_time_posted(
                current_time_since_posted, hour_or_minute
            )
        elif re.search("minute", current_time_since_posted):
            hour_or_minute = re.search("minute", current_time_since_posted).group()
            # Calculate current_time_posted
            current_time_posted = calculate_time_posted(
                current_time_since_posted, hour_or_minute
            )

        else:
            current_time_posted = "not today"

    while current_video:

        # Append current video to approved articles if the video is from today
        # This scraper is different from our others since it is scraping youtube
        if current_time_posted != "not today":
            approved_articles.append(
                {
                    "headline": current_video_title,
                    "link": current_link,
                    "image": current_image_link,
                    "date_posted": date,
                    "time_posted": current_time_posted,
                    "publisher": publisher,
                }
            )

        # Priming read for the scraping loop
        current_video = current_video.find_next("ytd-grid-video-renderer")
        if current_video:
            current_video_title = current_video.find("h3").a.text
            current_link = (
                links["youtube"]["base"]
                + current_video.find("a", id="thumbnail")["href"]
            )
            current_image_link = current_video.find("img", id="img")["src"]
            current_metadata = current_video.find("div", id="metadata-line")
            # The two metadata spans have the same class names, so two find_next statements are used here
            current_time_since_posted = (
                current_metadata.find_next("span").find_next("span").text
            )
            # Find hour or minute in current_time_since_posted
            if re.search("hour", current_time_since_posted):
                hour_or_minute = re.search("hour", current_time_since_posted).group()
                # Calculate current_time_posted
                current_time_posted = calculate_time_posted(
                    current_time_since_posted, hour_or_minute
                )

            elif re.search("minute", current_time_since_posted):
                hour_or_minute = re.search("minute", current_time_since_posted).group()
                # Calculate current_time_posted
                current_time_posted = calculate_time_posted(
                    current_time_since_posted, hour_or_minute
                )

            else:
                current_time_posted = "not today"

    headless_browser.quit()

    return approved_articles


def tweet_new_articles(article_list: List[ArticleEntry]) -> None:
    articles = article_list.copy()

    # Get auth tokens from Twitter API and create Tweepy API object
    auth = tweepy.OAuthHandler(
        os.getenv("TWITTER_CONSUMER_KEY"), os.getenv("TWITTER_CONSUMER_SECRET")
    )
    auth.set_access_token(
        os.getenv("TWITTER_ACCESS_TOKEN"), os.getenv("TWITTER_ACCESS_SECRET")
    )
    api = tweepy.API(auth)

    # Last headline variable to keep duplicates from being submitted for tweets
    last_headline = ""

    # Form the tweets into seperate strings that are combined in the api call
    # Tweet articles that are passed into the function
    for current_article in articles:

        if (
            current_article.publisher
            == "Chattanooga Times Free Press (subscription required)"
        ):
            current_publisher = "Times Free Press"
        else:
            current_publisher = current_article.publisher

        time_posted = current_article.time_posted.strip()

        # Reformat time_posted to 12 hour format
        if int(time_posted[:2]) > 12:
            current_time_posted = (
                str(int(time_posted[:2]) - 12) + ":" + time_posted[-2:]
            )
            AM_or_PM = "PM"

        elif int(time_posted[:2]) == 0:
            current_time_posted = "12:" + time_posted[-2:]
            AM_or_PM = "AM"

        elif int(current_article.time_posted[:2]) == 12:
            current_time_posted = time_posted
            AM_or_PM = "PM"

        else:
            # I type cast the string into an int and back to a string to get rid of the leading 0 in the string
            current_time_posted = str(int(time_posted[:2])) + ":" + time_posted[-2:]
            AM_or_PM = "AM"

        tweet_headline = current_article.headline
        tweet_byline = (
            "\n\nPublished by "
            + current_article.publisher
            + " at "
            + current_time_posted
            + " "
            + AM_or_PM
            + "\n\n"
        )
        tweet_link = current_article.link

        if current_article.headline != last_headline:
            # Combine strings and send tweet
            api.update_status(tweet_headline + tweet_byline + tweet_link)

        last_headline = current_article.headline

    # Status message
    logging.info("** New articles tweeted **")


def post_to_facebook(article_list: List[ArticleEntry]) -> None:
    articles = article_list.copy()

    # make graph object and assign facebook_page_id before looping through new articles
    graph = facebook.GraphAPI(os.getenv("GRAPH_ACCESS_TOKEN"))
    page_id = os.getenv("FACEBOOK_PAGE_ID")

    # Last headline variable to keep from posting duplicated
    last_headline = ""

    # Refine publisher feature
    for current_article in articles:
        if (
            current_article.publisher
            == "Chattanooga Times Free Press (subscription required)"
        ):
            current_publisher = "Times Free Press"

        else:
            current_publisher = current_article.publisher

        time_posted = current_article.time_posted.strip()

        # Reformat time_posted to 12 hour format
        if int(time_posted[:2]) > 12:
            current_time_posted = (
                str(int(time_posted[:2]) - 12) + ":" + time_posted[-2:]
            )
            AM_or_PM = "PM"

        elif int(time_posted[:2]) == 0:
            current_time_posted = "12:" + time_posted[-2:]
            AM_or_PM = "AM"

        elif int(current_article.time_posted[:2]) == 12:
            current_time_posted = time_posted
            AM_or_PM = "PM"

        else:
            # I type cast the string into an int and back to a string to get rid of the leading 0 in the string
            current_time_posted = str(int(time_posted[:2])) + ":" + time_posted[-2:]
            AM_or_PM = "AM"

        post_headline = current_article.headline
        post_byline = (
            "\n\nPublished by "
            + current_publisher
            + " at "
            + current_time_posted
            + " "
            + AM_or_PM
        )

        message_to_post = post_headline + post_byline

        if current_article.headline != last_headline:
            graph.put_object(
                page_id, "feed", message=message_to_post, link=current_article.link
            )

        last_headline = current_article.headline

    # print("** New articles posted to Facebook **")
    logging.info("** New articles posted to Facebook **")


# Scraper function
async def scrape_news() -> List[ArticleEntry]:
    if time.localtime()[8] == 1:
        logging.info("--- SCRAPER STARTING WITH DST ACTIVE ---")
    else:
        logging.info("--- SCRAPER STARTING WITH DST INACTIVE ---")

    # HTTP session to use for all scrapers
    # This should speed things up by not constantly having to open new connections for each scrape
    scraper_session = requests.Session()

    # List for our found articles
    articles = []

    # ---------- TIMES FREE PRESS ---------- #
    try:
        logging.info("TFP scraper started")

        times_breaking_articles, scraped_times_breaking = scrape_times_free_press(
            links["times_free_press"]["base"] + links["times_free_press"]["local_news"],
            get_date(1),
            scraper_session,
        )
        times_political_articles, scraped_times_political = scrape_times_free_press(
            links["times_free_press"]["base"]
            + links["times_free_press"]["local_politics"],
            get_date(1),
            scraper_session,
        )
        times_business_articles, scraped_times_business = scrape_times_free_press(
            links["times_free_press"]["base"]
            + links["times_free_press"]["region_business"],
            get_date(1),
            scraper_session,
        )

        tfp_articles = []
        tfp_articles.extend(times_breaking_articles)
        tfp_articles.extend(times_political_articles)
        tfp_articles.extend(times_business_articles)
        # tfp_articles = times_breaking_articles + times_political_articles + times_business_articles

        articles.extend(tfp_articles)

    except Exception as e:
        logging.error("exception caught in TFP scraper", exc_info=True)

    # ---------- CHATTANOOGAN ---------- #
    try:
        logging.info("Chattanoogan scraper started")

        chattanoogan_news_articles, scraped_chattanoogan_news = scrape_chattanoogan(
            links["chattanoogan"]["base"] + links["chattanoogan"]["breaking"],
            get_date(1),
            scraper_session,
            "b/p",
        )
        (
            chattanoogan_happenings_articles,
            scraped_chattanoogan_happenings,
        ) = scrape_chattanoogan(
            links["chattanoogan"]["base"] + links["chattanoogan"]["happenings"],
            get_date(1),
            scraper_session,
            "happenings",
        )
        (
            chattanoogan_business_articles,
            scraped_chattanoogan_business,
        ) = scrape_chattanoogan(
            links["chattanoogan"]["base"] + links["chattanoogan"]["business"],
            get_date(1),
            scraper_session,
        )
        articles.extend(chattanoogan_news_articles)
        articles.extend(chattanoogan_happenings_articles)
        articles.extend(chattanoogan_business_articles)

    except Exception as e:
        logging.error("Exception caught in Chattanoogan scraper", exc_info=True)

    # ---------- FOX CHATTANOOGA ---------- #
    try:
        logging.info("Fox Chattanooga scraper started")

        fox_chattanooga_articles, scraped_fox_chattanooga = scrape_fox_chattanooga(
            links["fox_chattanooga"]["base"] + links["fox_chattanooga"]["local_news"],
            get_date(6),
        )
        articles.extend(fox_chattanooga_articles)

        relevant_fox_chattanooga = len(fox_chattanooga_articles)

    except Exception as e:
        logging.error("Exception caught in Fox Chattanooga scraper", exc_info=True)

    finally:
        os.system("pkill -f firefox")
        logging.info("Firefox pkill, RAM cleared")

    # ---------- WDEF ---------- #
    try:
        logging.info("WDEF scraper started")

        wdef_articles, scraped_wdef = scrape_wdef(
            links["wdef"]["base"] + links["wdef"]["local_news"],
            get_date(8),
            scraper_session,
        )
        articles.extend(wdef_articles)

    except Exception as e:
        logging.error("Exception caught in WDEF scraper", exc_info=True)

    # ---------- NOOGA TODAY ---------- #
    try:
        logging.info("Nooga Today scraper started")

        (
            nooga_today_news_articles,
            scraped_nooga_today_news,
        ) = scrape_nooga_today_breaking_political(
            links["nooga_today"]["base"] + links["nooga_today"]["local_news"],
            get_date(1),
            "news",
        )
        (
            nooga_today_city_articles,
            scraped_nooga_today_city,
        ) = scrape_nooga_today_non_political(
            links["nooga_today"]["base"] + links["nooga_today"]["city"],
            get_date(1),
            "city",
        )
        (
            nooga_today_food_articles,
            scraped_nooga_today_food,
        ) = scrape_nooga_today_non_political(
            links["nooga_today"]["base"] + links["nooga_today"]["food_drink"],
            get_date(1),
            "food + drink",
        )
        articles.extend(nooga_today_news_articles)
        articles.extend(nooga_today_city_articles)
        articles.extend(nooga_today_food_articles)

    except Exception as e:
        logging.error("Exception caught in Nooga Today scraper", exc_info=True)

    finally:
        os.system("pkill -f firefox")
        logging.info("Firefox pkill, RAM cleared")
    # ---------- CHATTANOOGA PULSE ---------- #
    try:
        logging.info("Pulse scraper started")

        pulse_news_articles, scraped_pulse_news = scrape_pulse(
            links["chattanooga_pulse"]["base"]
            + links["chattanooga_pulse"]["local_news"],
            get_date(1),
            scraper_session,
        )

        pulse_city_articles, scraped_pulse_city = scrape_pulse(
            links["chattanooga_pulse"]["base"]
            + links["chattanooga_pulse"]["city_life"],
            get_date(1),
            scraper_session,
        )

        articles.extend(pulse_news_articles)
        articles.extend(pulse_city_articles)

    except Exception as e:
        logging.error("Exception caught in Pulse scraper", exc_info=True)

    # ---------- CHATTANOOGA NEWS CHRONICLE ---------- #
    # try:
    #     chronicle_top_articles, scraped_chronicle_top = scrape_chattanooga_news_chronicle(links['chattanooga_news_chronicle']['base'] + links['chattanooga_news_chronicle']['top_stories'], get_date(6))
    #     chronicle_community_articles, scraped_chronicle_community = scrape_chattanooga_news_chronicle(links['chattanooga_news_chronicle']['base'] + links['chattanooga_news_chronicle']['community'], get_date(6))
    #     #chronicle_health_articles = scrape_chattanooga_news_chronicle(links['chattanooga_news_chronicle']['base'] + links['chattanooga_news_chronicle']['health'], get_date(6))
    #     chronicle_featured_articles, scraped_chronicle_featured = scrape_chattanooga_news_chronicle(links['chattanooga_news_chronicle']['base'] + links['chattanooga_news_chronicle']['featured'], get_date(6))
    #     articles.extend(chronicle_top_articles)
    #     articles.extend(chronicle_community_articles)
    #     articles.extend(chronicle_featured_articles)

    #     scraped_chronicle = scraped_chronicle_featured + scraped_chronicle_community + scraped_chronicle_top
    #     relevant_chronicle = len(chronicle_featured_articles) + len(chronicle_top_articles) + len(chronicle_community_articles)

    #     stats['scraped_chronicle'] = scraped_chronicle
    #     stats['relevant_chronicle'] = relevant_chronicle

    # except Exception as e:
    #     print('\tException caught in Chronicle scraper')
    #     print(e)
    #     print()

    #     try:
    #         stats['scraped_chronicle'] = current_stats['scraped_chronicle']
    #         stats['relevant_chronicle'] = current_stats['relevant_chronicle']
    #     except:
    #         stats['scraped_chronicle'] = 0
    #         stats['relevant_chronicle'] = 0

    # os.system('pkill -f firefox')

    # ---------- Local 3 News ---------- #
    try:
        logging.info("Local 3 scraper started")

        local_three_articles, scraped_local_three = scrape_local_three(
            links["local_three"]["base"] + links["local_three"]["local_news"],
            get_date(1),
        )

        articles.extend(local_three_articles)

    except Exception as e:
        logging.error("Exception caught in Local 3 News scraper", exc_info=True)

    deduped_articles = [*set(articles)]
    filtered_articles = filter(lambda x: x.headline != "DOWN", deduped_articles)

    os.system("pkill -f firefox")
    logging.info("Firefox pkill, RAM cleared")
    logging.info("--- SCRAPER EXITING --- \n")

    return list(filtered_articles)


def Sort(sub_li: List[ArticleEntry], to_reverse: bool) -> List[ArticleEntry]:
    # reverse = None (Sorts in Ascending order)
    # key is set to sort using second element of
    # sublist lambda has been used
    sub_li.sort(key=lambda x: x.time_posted, reverse=to_reverse)
    return sub_li


async def already_saved(
    article: ArticleEntry, table: sqlalchemy.Table, db: Database
) -> bool:
    async def get_result(db, query):
        return await db.execute(query)

    query = (
        table.select()
        .exists()
        .select()
        .where((table.c.link == article.link) | (table.c.headline == article.headline))
    )

    task = asyncio.create_task(get_result(db, query))
    done, pending = await asyncio.wait({task})
    # return True if the query has a result
    #   this returns None when the story being queried doesn't exist
    if task in done:
        return True if task.result() else False


async def save_articles(conn: MC_Connection, articles: List[ArticleEntry]) -> None:
    list_articles_saved = []
    articles_saved = 0
    table = conn.get_table("articles")
    if isinstance(table, Ok):
        table = table.unwrap()
        for article in articles:
            if not await already_saved(article, table, conn.get_db_obj()):
                query = table.insert().values(
                    headline=article.headline,
                    link=article.link,
                    image=article.image,
                    time_posted=article.time_posted,
                    publisher=article.publisher,
                )
                await conn.get_db_obj().execute(query)
                articles_saved += 1
                list_articles_saved.append(article)
        logging.info(str(articles_saved) + " articles saved")
    tweet_new_articles(list_articles_saved)
    post_to_facebook(list_articles_saved)


async def main() -> None:
    # Scrape news, make db connection in the meantime
    data_highway = MC_Connection()
    current_articles = await scrape_news()
    # Connect to the database
    task = asyncio.create_task(data_highway.plug_in())
    done, pending = await asyncio.wait({task})

    # Save new articles to database after connecting
    if task in done:
        try:
            await save_articles(data_highway, current_articles)
        except Exception as e:
            logging.error(e)
        finally:
            # Close db connection
            await data_highway.unplug()


if __name__ == "__main__":
    asyncio.run(main())
