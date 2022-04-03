#!/usr/bin/env python3

# ************************************************** #
#
# Author: Ryne Burden
#
# Description: 
#    - This script gathers daily news from all local Chattanooga news sources
#
# Outputs:
#    - The script will output a list with every relevant article from the day
#
# ************************************************** #
import os
import asyncio
import re
import sys
import time
import pickle
from xmlrpc.client import Boolean
import tweepy
import logging
import sqlite3
import requests
import facebook
import traceback
from typing import NamedTuple
from pytz import timezone
from sqlite3 import Cursor, Error
from datetime import datetime
from selenium import webdriver
from bs4 import BeautifulSoup as bs
from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configure logger
logging.basicConfig(
    filename='myChattanooga.log',
    filemode='a',
    format='%(asctime)s - %(message)s',
    datefmt='%d-%b-%y %H:%M:%S',
    level=logging.INFO
)

# This dictionary contains all the needed links for scraping
links = {
    
    'chattanoogan': {
        'base' : 'https://www.chattanoogan.com',
        'breaking' : '/List.aspx?ArticleTypeID=1',
        'happenings' : '/List.aspx?ArticleTypeID=4',
        'dining' : '/List.aspx?ArticleTypeID=6',
        'business' : '/List.aspx?ArticleTypeID=10',
        'school' : '/List.aspx?ArticleTypeID=11',
        'entertainment' : '/List.aspx?ArticleTypeID=82'},

    'fox_chattanooga': {
        'base' : 'https://foxchattanooga.com',
        'local_news' : '/news/local',
        'gas_prices' : '/news/area-gas-prices'},

    'times_free_press': {
        'base' : 'https://www.timesfreepress.com',
        'local_news' : '/news/local/',
        'region_business' : '/news/business/aroundregion/',
        'business_diary' : '/news/business/diary/',
        'local_politics' : '/news/politics/regional/',
        'dining' : '/news/chattanooganow/dining',
        'music' : '/news/chattanooganow/music/',
        'out_and_about' : '/news/chattanooganow/outabout/'},

    'wdef': {
        'base' : 'https://wdef.com',
        'local_news' : '/category/local-news/'},

    'nooga_today': {
        'base' : 'https://noogatoday.6amcity.com',
        'local_news' : '/category/news/',
        'city' : '/category/cities/',
        'food_drink' : '/category/food-drink/',
        'lifestyle' : '/category/lifestyle/'},

    'chattanooga_pulse': {
        'base' : 'http://www.chattanoogapulse.com',
        'local_news' : '/local-news',
        'city_life' : '/citylife',
        'arts' : '/arts',
        'music' : '/music',
        'food_drink' : '/food-drink'},

    'chattanooga_news_chronicle': {
        'base': 'https://chattnewschronicle.com',
        'top_stories': '/category/top-stories/',
        'community': '/category/community-connection/',
        'health': '/category/health/',
        'featured': '/category/featured/'},

    'local_three': {
        'base': 'https://local3news.com',
        'local_news': '/local-news/'},

    'youtube': {
        'base': 'https://youtube.com',
        'cha_guide': '/channel/UCqO3AVi0ZtkL_VcME0C8Acg/videos',
        'scenic_city_records': '/channel/UCg5EeMkT78fG_JK-R0NPmaA/videos'},

    'brew_chatt': {
        'base': 'http://brewchatt.com',
        'bcpod': '/bcpod',
        'chaos': '/inchaoswetrust'}
}

# This list will contain all Chattanooga area towns and sections
# They will be used as keywords for regex searches of the current headline and excerpt
region_keywords = ['chattanooga',
                   'chatt state',
                   ' chatt ',
                   ' utc ',
                   'east brainerd',
                   'middle valley',
                   'harrison',
                   'apison',
                   'monteagle',
                   'hamilton county',
                   'hamilton co',
                   'signal mountain',
                   'lookout mountain',
                   'ridgeside',
                   'soddy daisy',
                   'soddy-daisy',
                   'collegedale',
                   'ridgeside',
                   'tennessee valley',
                   'hixson',
                   'east ridge',
                   'brainerd',
                   'red bank',
                   'red-bank',
                   'ooltewah',
                   'tva',
                   'epb',
                   'erlanger',
                   'city council',
                   'tennessee american water',
                   'tennessee valley authority',
                   'jasper',
                   'avondale',
                   'best and worst restaurant inspection',
                   'st. elmo',
                   'cpd',
                   'north shore',
                   "today's weather",
                   'lee university',
                   'cleveland',
                   'suck creek',
                   'collegedale']

# This list will be used for Chattanooga happenings article filtering 
chattanoogan_keywords = ['weekly road construction report',
                         'mayoral',
                         'city council',
                         'mayor',
                         'food drive',
                         'closed',
                         'cdot',
                         'upcoming street closures',
                         'cpd',
                         'county commission']

keywords_to_avoid = ['georgia',
                     'alabama',
                     'north carolina',
                     'jerry summers',
                     'life with ferris',
                     'fort oglethorpe',
                     'dalton',
                     'rossville',
                     'ringgold',
                     'catoosa',
                     'biden',
                     'kamala',
                     'ohio',
                     'white house',
                     'get emailed headlines from chattanoogan.com']

def print_keywords():
    for x in region_keywords:
        print(x + "<br>")


# This function is just an easy way to query the current date
def get_date(format):

    suffixes = {
        '1': 'st',
        '2': 'nd',
        '3': 'rd',
        '4': 'th',
        '5': 'th',
        '6': 'th',
        '7': 'th',
        '8': 'th',
        '9': 'th',
        '10': 'th',
        '11': 'th',
        '12': 'th',
        '13': 'th',
        '14': 'th',
        '15': 'th',
        '16': 'th',
        '17': 'th',
        '18': 'th',
        '19': 'th',
        '20': 'th',
        '21': 'st',
        '22': 'nd',
        '23': 'rd',
        '24': 'th',
        '25': 'th',
        '26': 'th',
        '27': 'th',
        '28': 'th',
        '29': 'th',
        '30': 'th',
        '31': 'st'
    }

    today = datetime.now()

    day = today.strftime('%-d')

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
        return today.strftime('%-H:%M')
    

# This function will add a 0 to the beginning of the published date of a given article
def refine_article_date(date):

    # Test case for single digit month and day values
    if (re.search('^\d/\d/\d\d\d\d', date)):
        
        # Perform the match and grab the matching string
        date_match = re.search('^\d/\d/\d\d\d\d', date)
        date_match = date_match.group()
        
        # Add 0's to the month and day portions of the date
        new_date = "0" + date_match[:2] + "0" + date_match[2:]

    # Test case for single digit month and double digit day
    elif (re.search('^\d/\d\d/\d\d\d\d', date)):
        date_match = re.search('^\d/\d\d/\d\d\d\d', date)
        date_match = date_match.group()

        # Add 0 to the month portion of the date
        new_date = "0" + date_match

    # Test case for double digit month and single digit date
    elif (re.search('^\d\d/\d/\d\d\d\d', date)):
        date_match = re.search('^\d\d/\d/\d\d\d\d', date)
        date_match = date_match.group()
        
        new_date = date_match[:3] + "0" + date_match[3:]

    # Test case for double digit month and day portions of the date. This is a failsafe to avoid extra characters
    elif (re.search('^\d\d/\d\d/\d\d\d\d', date)):
        date_match = re.search('^\d\d/\d\d/\d\d\d\d', date)
        new_date = date_match.group()

    # Return the new date
    return new_date


# This function will change the time from 12 hour to 24 hour format
def refine_article_time(time):

    # Assign hour, minute, and time_of_day for each possible time configuration
    # 1 digit hour search case
    if (re.search('\W\w:\w\w \w\w', time)):
        time = re.search('\W\w:\w\w \w\w', time).group()
        hour = "0" + time[1]
        minute = time[3:5]
        time_of_day = time[-2:]

     # 2 digit hour search case
    elif (re.search('\w\w:\w\w \w\w', time)):
        time = re.search('\w\w:\w\w \w\w', time).group()
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
            #hour = int(hour) + 1
            return str(hour) + ":" + minute


# This is used for determining posted times for Times Free Press articles
def calculate_time_posted(time_since_posted, hour_or_minute):

    # Load current time into a variable
    now = datetime.now()
    now = str(now.strftime('%H:%M'))
    posted_hour = now[:2]
    posted_minute = now[-2:]

    # If check for articles posted minutes ago
    if hour_or_minute == 'minute':

        # The .replace accounts for sub-10 minute intervals (e.g. 4 minutes ago)
        posted_minute = str(int(posted_minute) - int(time_since_posted[:2].replace(" ", "")))

        # If the difference of the current and posted minute is negative then take it away from 60
        # and decrement hour
        if (int(posted_minute) < 0):
            posted_hour = str(int(posted_hour) - 1)
            posted_minute = str(60 + int(posted_minute))

        # Articles posted on the hour will result in a single 0 for minute since
        # int zeroes are only themselves
        elif int(posted_minute) == 0:
            posted_minute = '00'

        # This if statement checks for single digit hours
        # and adds a 0 in front for continuity with the other scrapers
        if len(posted_hour) == 1:
            return str('0' + posted_hour + ':' + posted_minute)
        else:
            return str(posted_hour + ':' + posted_minute)

    elif hour_or_minute == 'hour':

        # Increment posted hour by 1 if current minute is over 30
        if int(posted_minute) > 30:
            posted_hour = str(int(posted_hour) + 1)

        posted_hour = str(int(posted_hour) - int(time_since_posted[:2].replace(" ", "")))

        if int(posted_hour) >= 0:
        
            if len(posted_hour) == 1:
                return str('0' + posted_hour + ':' + "00")
            else:
                return str(posted_hour + ":00")

        else:

            # return "not today" if the posted_hour is negative which would indicate a video from yesterday
            return str("not today")
            

# This function determines if Times Free Press articles are from today
def is_from_today(link):

    # Get the page html and load into a bs object
    article_request = requests.get(link)
    article_soup = bs(article_request.text, 'lxml')

    # Find the byline
    byline = article_soup.find('span', class_ = 'most-recent-article-bi-line')

    # This was added to account for story series without bylines
    if byline:
        byline = byline.text
        if re.search(get_date(8), byline):
            return True
    else:
        return False


# This function is used to dtermine is an article is relevant by searching
# The region keyword list
def is_relevant_article(headline='', excerpt=''):

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


def is_relevant_chattanoogan(headline=''):

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

                return current_articles[x+1]
        
    elif len(current_articles) == 2:

        if re.search(headline, str(current_articles[0])):

            return current_articles[1]

    # Returns None if the story isn't found
    return None


# This function writes headlines and their posted times to the open file
def write_to_times_file(found_articles, file_name):

    # Load current articles into a list and make an empty list if the pickle load throw and exception
    try:
        current_tfp_articles = pickle.load(open(file_name, 'rb'))
    except :
        current_tfp_articles = []

    # iterate the list backwards to help with popping
    for current in reversed(found_articles):

        # See if the article is already saved
        time_accounted_for = search_tfp_times(current['headline'].lower().rstrip(), current_tfp_articles)

        # Ignore the current story if found
        if time_accounted_for:
            #print(current['headline'])
            #print(time_accounted_for)
            # pop the story and time if found
            
            found_articles.pop()

            #print("found and popped, not saved")

        # Add current story to current_tfp_articles before popping
        else:
            current_tfp_articles.append(current['headline'].lower().rstrip())
            current_tfp_articles.append(current['time_posted'])

            #print(current['headline'])
            #print(current['time_posted'])

            found_articles.pop()

            #print("popped and saved")
            
    pickle.dump(current_tfp_articles, open(file_name, 'wb'))


# This funciton deletes stories from tfp lists that are duplicates
def delete_dupes(tfp_list):

    to_return = tfp_list.copy()

    duplicated_indices = list()

    for x in range(len(to_return)):
        for y in range(len(to_return) - 1):
            if y != x:
                if to_return[y]['headline'].lower().rstrip() == to_return[x]['headline'].lower().rstrip():
                    duplicated_indices.append(y)

    for x in range(len(duplicated_indices) - 1, int(len(duplicated_indices) / 2) - 1, -1):
        #print(x)
        #print(to_return[duplicated_indices[x]]['headline'])

        tfp_list.pop(duplicated_indices[x])


# This function will go to the given link and return the body of the article
def get_pulse_article_content(link, session):

    # Make a string to return
    text_to_return = ''

    # Get the article page and make a soup object with it
    #request = requests.get(link)
    current_soup = bs(session.get(link).text, 'lxml')

    # Get the article
    current_article_content = current_soup.find('article')

    # Get the first p tag
    current_p_tag = current_article_content.find('p', class_ = 'lead')

    # Find all p tags and append them to text_to_return
    while current_p_tag:

        text_to_return = text_to_return + current_p_tag.text + '\n\n'

        current_p_tag = current_p_tag.find_next_sibling('p')

    # Return the string
    return text_to_return


def count_articles(article_list, publisher):

    count = 0

    for article in article_list:
        if article['publisher'] == publisher:
            count += 1

    return count


def get_wdef_article_content(link, session):

    # Make a string to return
    string_to_return = ''

    # Get the article page and make a soup object with it
    # request = requests.get(link)
    current_soup = bs(session.get(link).text, 'lxml')

    # Get the article
    current_article_content = current_soup.find('div', class_ = 'basic-content-wrap cf')

    # Get the first p tag
    current_p_tag = current_article_content.find('p')

    # Find all p tags and append them to text to return
    while current_p_tag:

        string_to_return = string_to_return + current_p_tag.text + '\n\n'

        current_p_tag = current_p_tag.find_next('p')

    return string_to_return


# Each scrape function will output a dictionary of articles with included timestamp
# Category will only be used for breaking/political articles
def scrape_chattanoogan(url, date, session, category=None):

    # This list will hold all the objects to be output
    # Each object will contain a link, a headline, and a date/time
    approved_articles = list()

    # This variable will be used to count how many total articles are found and scraped
    total_articles_scraped = 0

    # publisher name to be returned and used for sorting on website and newsletter
    publisher = "Chattanoogan"
    # image link for chattanoogan articles
    chattanoogan_logo = 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/v1419646557/tkf8rnu2zxzn3l1nyd2h.png'
    
    # try statement to account for the website being down
    try:

        # Get HTML from the queried page and make it into a soup object
        chattanoogan_soup = bs(session.get(url).text, "lxml")

    except:

        # Return a dictionary that indicated the website is down or can't be reached
        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None
        
    # This variable will hold the content table from chattanoogan.com
    content_section = chattanoogan_soup.find("table", class_ = "list")

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
        current_link = links['chattanoogan']['base'] + str(current_data.a['href'])
        current_date_time = current_data.find_next("td").text # The date here is the first 10 characters of this tag
        
        # Refine the date and time to be in the correct format
        current_date = refine_article_date(current_date_time[:11])
        current_time = refine_article_time(current_date_time[-8:])

        # Further process the current_article if it is from today
        if current_date == date:

            # Add 1 to total_articles_scraped if an article is found
            total_articles_scraped += 1
            
            # This block will change time and date strings to datetime objects
            current_date = datetime.strptime(current_date.strip(), '%m/%d/%Y').date()
            current_time = datetime.strptime(current_time.strip(), '%H:%M').strftime("%H:%M")

            # This flags articles as "later" if they have a time from later in the day
            # Chattanoogan needs to get their shit together with scheduling
            if int(get_date(10)[:2]) - int(current_time[:2]) < 0:
                now_or_later = "later"
            else:
                now_or_later = "now"
            
            # category wil only have a value if set in the function call since it defaults to None
            # I use this only for breaking/political articles
            if category == 'b/p':

                # Add to approved articles if the headline has chatt or hamilton county in it
                # This avoids making unecessary requests to the chattanoogan's website
                if is_relevant_article(current_headline) and now_or_later == "now":

                    # Add data to approved articles list
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': chattanoogan_logo,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time,
                                              'publisher': publisher})
                    
                else:
                    # Go the the current article and search for chattanooga or hamilton county in the story
                    # add story to temp list and approved articles if it's about chatt or hamilton county
                    if is_relevant_article(current_headline, bs(session.get(current_link).text, 'lxml').find('div', class_ = 'story').text) and now_or_later == "now":

                        # Add data to the approved articles list
                        approved_articles.append({'headline': current_headline,
                                                  'link': current_link,
                                                  'image': chattanoogan_logo,
                                                  'date_posted': get_date(7),
                                                  'time_posted': current_time,
                                                  'publisher': publisher})
                        
            # Append to temp_list and approved_articles if the article is for the non-political section
            elif category == 'happenings':

                # New function to filter happenings articles
                if is_relevant_chattanoogan(current_headline) and now_or_later == "now":
                
                    # Add data to approved articles list
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': chattanoogan_logo,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time,
                                              'publisher': publisher})

            # This last if statement is for business articles 
            else:

                # Check for relevancy
                # Only check headline here to filter out some non relevant stuff
                if is_relevant_article(current_headline) and now_or_later == "now":

                    # Add data to approved articles list
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': chattanoogan_logo,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time,
                                              'publisher': publisher})
                    
        elif current_date != date and story > 0:

            # Break out of the loop if date_posted isn't today
            # Since every article from now on will be from another 
            break
            
    return approved_articles, total_articles_scraped


def scrape_fox_chattanooga(url, date):

    # This list will hold boolean values to determine if articles
    # are about Chattanooga or Hamilton County
    approved_articles = list()
    all_local_stories = list()
    
    # Thsi variables will count how many articles in total are analyzed each time the script is runned
    total_articles_scraped = 0
    
    # Publisher variable to append to temp list
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
            EC.presence_of_element_located((By.CLASS_NAME, 'twoColumn-module_columnOne__179p'))
        )

        # Grab the HTML source from the browser and load it into a bs object
        local_news_page_soup = bs(headless_browser.page_source, 'lxml')
        
        # This variable holds the section with all the local news articles on channel 9
        # It will be used for searching in the for loop below to get links for each actual local story
        #content_section = local_news_page_soup.find('div', class_ = 'index-module_leftInner__Qolw')
        content_section = local_news_page_soup.find('div', class_ = 'twoColumn-module_columnOne__179p')

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()
        
        # quit the browser and return a list to indicate the website is down or can't be reached
        headless_browser.quit()

        return [{'headline': 'DOWN',
                 'publisher': publisher,
                 'date_posted': get_date(7)}], None
        
    # Priming read before the main scraping loop
    # The a tags hold most of the info needed
    current_article = content_section.find('div', class_ = 'index-module_teaser__2qaT')
    current_headline = current_article.find('a')['alt']
    current_link = current_article.find('a')['href']
    
    # Find the image div for the premiere article on news channel nine local news
    # The alt for these images follows a scheme everytime
    current_image_div = current_article.find('div', alt = 'Image for story: ' + current_headline)

    # This extracts the image link used for the article
    # The replace takes out the parenthetical casing in the style tag
    # The split puts all elements of the style tag into a list, where the url is at index 1
    current_image_link = current_image_div['style'].replace('url("', '').replace('");', '').split()[1]

    # temp list for holding values before they are appended to all_local_stories
    temp_list = list()
    
    # Add all needed info to temp_list if the story is from news/local or news/coronavirus
    if is_relevant_article(current_headline):

        # add data to all_local_stories
        all_local_stories.append({'headline': current_headline,
                                  'link': 'https://foxchattanooga.com' + current_link,
                                  'image': 'https://foxchattanooga.com' + current_image_link})

    # This loop scrapes every story on the main local news page
    for story in range(0, 16):

        # The a tags hold most of the info needed
        current_article = current_article.find_next('div', class_ = 'index-module_teaser__2qaT')
        current_headline = current_article.find('a')['alt']
        current_link = current_article.find('a')['href']
    
        # Find the image div for the premiere article on news channel nine local news
        # The alt for these images follows the same scheme
        current_image_div = current_article.find('div', alt='Image for story: ' + current_headline)

        # This extracts the image link used for the article
        # The replace takes out the parenthetical casing in the style tag
        # The split puts all elements of the style tag into a list, where the url is at index 1
        current_image_link = current_image_div['style'].replace('url("', '').replace('");', '').split()[1]

        # If check to only append info from news/local and news/coronavirus
        if is_relevant_article(current_headline):

            # Add data to all_local_stories
            all_local_stories.append({'headline': current_headline,
                                      'link': 'https://foxchattanooga.com' + current_link,
                                      'image': 'https://foxchattanooga.com' + current_image_link})


    # This loop will only pass stories that are about chattanooga and hamilton county
    # To the approved_local_stories list
    for story in all_local_stories:

        try:

            # Make a bs object for the current story
            headless_browser.get(story['link'])
            time.sleep(3)
            
        # This accounts for the dictionary not having any key: value pairs
        except KeyError:

            continue
            
        # Wait for page to load
        headless_browser.implicitly_wait(5)
        
        current_article_page_soup = bs(headless_browser.page_source, 'lxml')

        # Find dateline and time, on these pages it usually shows what town the news is from
        # I'm deleting the last 2 characters of each dateline because they are useless
        # lower() is used to make searching more effective
        current_dateline = current_article_page_soup.find('span', class_ = 'dateline')

        # Set the current headline variable to help in classifying articles below
        current_headline = story['headline']

        current_datetime = current_article_page_soup.find('time')['datetime']

        # Change date into EST
        current_datetime = current_datetime.replace("T", " ")
        current_datetime = current_datetime[:-5]
        current_datetime = datetime.strptime(current_datetime, "%Y-%m-%d %H:%M:%S")
        current_datetime = current_datetime.replace(tzinfo=timezone('UTC'))
        current_datetime = current_datetime.astimezone(timezone('US/Eastern'))

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

                    # Append to approved_articles
                    approved_articles.append({'headline': story['headline'],
                                              'link': story['link'],
                                              'image': story['image'],
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})

                else:

                    # Break out of the loop if an article isn't from today
                    # This is commented out for now because News Channel 9 uses universal time clock which messes everything up after like 7pm
                    break
                    
                
        else:

            # I changed this to use the text from the <time> tag
            # because sometimes that doesn't match the posted date
            # The date here is get_date(3)
            # (e.g. December 9 2020)
            if current_date_posted == date:

                total_articles_scraped += 1
            
                if is_relevant_article(current_headline):

                    # Append to approved_articles
                    approved_articles.append({'headline': story['headline'],
                                              'link': story['link'],
                                              'image': story['image'],
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})
                else:

                    # Break out of the loop if an article isn't from today
                    break

    # Delete cookies before quitting the browser
    headless_browser.delete_all_cookies()
                    
    # Quit the browser
    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_wdef(url, date, session):

    # List to return at the end of the function
    approved_articles = list()

    # Variables for news analytics
    total_articles_scraped = 0

    # Publisher to be added to temp list
    publisher = "WDEF News 12"

    try:

        #wdef_request = requests.get(url)
        wdef_soup = bs(session.get(url).text, 'lxml')

    except:

        # Return a list indicating that website is down or can't be reached
        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None
        
    # Main content section
    # Multiple finds are needed given how wdef has their website set up
    content_section = wdef_soup.find('div', class_ = 'loop-wrapper articles main-loop-wrapper')

    # While loop priming read
    current_article = content_section.find('article', class_ = 'post')
    current_headline = current_article.find('h3').find('a').text
    current_link = current_article.find('h3').find('a')['href']
    current_article_body = get_wdef_article_content(current_link, session)
    current_image_link = current_article.find('img')['src']
    current_date_posted = current_article.find('time', class_ = 'entry-time').text
    current_time_posted = get_date(10)

    # Append if the article was posted today
    if current_date_posted == date:

        total_articles_scraped += 1

        # Append article to temp list and approved articles if the news is from chattanooga
        if is_relevant_article(current_headline):

            # Append to approved_articles
            approved_articles.append({'headline': current_headline,
                                      'link': current_link,
                                      'image': current_image_link,
                                      'date_posted': get_date(7),
                                      'time_posted': current_time_posted,
                                      'publisher': publisher})

        # Sometimes articles are tagged chattanooga in the actual article but not the td-excerpt
        # This won't be picked up by the first if, therefore this else statement is needed
        else:
            current_page_soup = bs(session.get(current_link).text, 'lxml')

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
        current_article = current_article.find_next('article', class_='post')
        current_headline = current_article.find('h3').find('a').text
        current_link = current_article.find('h3').find('a')['href']
        current_article_body = get_wdef_article_content(current_link, session)
        current_image_link = current_article.find('img')['src']
        current_date_posted = current_article.find('time', class_='entry-time').text
        current_time_posted = get_date(10)

        # Append if the article was posted today
        if current_date_posted == date:

            total_articles_scraped += 1

            if is_relevant_article(current_headline):

                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                          'link': current_link,
                                          'image': current_image_link,
                                          'date_posted': get_date(7),
                                          'time_posted': current_time_posted,
                                          'publisher': publisher})
                
            # Sometimes articles are tagged chattanooga in the actual article but not the td-excerpt
            # This won't be picked up by the first if, therefore this else statement is needed
            else:

                if is_relevant_article(current_article_body):

                    # Append to approved_articles
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})

        else:

            # Break out of the loop if an article from another day is found
            return approved_articles, total_articles_scraped
                    
    return approved_articles, total_articles_scraped    


def scrape_times_free_press(url, date, session):

    # Approved articles list and temp_list for scraping
    #temp_list = list()
    approved_articles = list()

    # Variable for use in scraping
    total_articles_scraped = 0

    # Variable for use in scraping
    current_time_posted = None

    # Publisher tag for temp_list
    publisher = "Chattanooga Times Free Press (subscription required)"

    # Output file for writing TFP article post times
    times_file_name = os.path.dirname(os.path.realpath('__file__')) + '/data/TFP_By_Day/tfp-article-times-' + get_date(3) + '.tfp'
    #times_file = open(times_file_name, 'a')

    os.system('touch ' + times_file_name)

    try:
    
        # Get the page request and make a bs object with it
        #times_request = requests.get(url)
        times_soup = bs(session.get(url).text, 'lxml')

    except:

        # Return a list indicating that site can't be reached
        return [{'headline': 'DOWN',
                 'publisher': publisher,
                 'date_posted': get_date(7)}], None
        
    # Main content section
    content_section = times_soup.find('div', class_ = 'recommended')

    # Priming read for scraping loop
    current_article = content_section.find('div', 'recommended-article recommended__article first')
    current_headline = current_article.find('span', 'recommended__article-title').a.text.rstrip()
    current_excerpt = current_article.find('p', 'recommended__article-lead').text.lower()
    current_link = current_article.find('span', 'recommended__article-title').a['href']
    current_image_div = current_article.find('a', class_ = 'recommended__article-image')
    current_image_link = current_image_div['style'].split()[1].replace("url('", '').replace("');", '')
    current_byline = current_article.find('span', class_ = 'recommended__article-bi-line').text.lower()

    # Get the right time data based on if the article was posted over or under an hour ago
    if re.search("\d minute", current_byline):

        # Search for double digit minutes before single digits
        # To avoid time keeping bugs
        if re.search("\d\d minute", current_byline):
            current_time_since_posted = re.search("\d\d minute", current_byline).group()
        else:
            current_time_since_posted = re.search("\d minute", current_byline).group()

    elif re.search("\d hour", current_byline):

        # Search for double digit hours before single digits
        # To avoid time keeping bugs
        if re.search("\d\d hour", current_byline):
            current_time_since_posted = re.search("\d\d hour", current_byline).group()
        else:
            current_time_since_posted = re.search("\d hour", current_byline).group()
    else:
        current_time_since_posted = "none"

    while (current_article):

        if is_from_today(links['times_free_press']['base'] + current_link):

            total_articles_scraped += 1

            # Append all information to approved_articles if the article is about chattanooga and from today
            if is_relevant_article(current_headline, current_excerpt):
                
                # DELETE THIS EVENTUALLY CURRENTLY BEING TESTED LOCALLY ON EL TIGRE
                found_time = search_tfp_times(current_headline.lower(), times_file_name)

                # If checks for stories posted any number of hours ago OR if the file already exists
                if found_time:
                    current_time_posted = found_time

                elif re.search('hour', current_time_since_posted):
                    hour_or_minute = re.search('hour', current_time_since_posted).group().lower()
                    current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)
                
                elif re.search('minute', current_time_since_posted):
                    hour_or_minute = re.search('minute', current_time_since_posted).group().lower()
                    current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)
                    
                else:
                    # This condition account for articles that are posted without a recent timestamp
                    # I found this happening in the business articles
                    current_time_posted = get_date(10)

                current_date_posted = get_date(1)

                # Convert time and date posted to datetime objects
                current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
                if current_time_posted:
                    current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                          'link': links['times_free_press']['base'] + current_link,
                                          'image': current_image_link,
                                          'date_posted': get_date(7),
                                          'time_posted': current_time_posted,
                                          'publisher': publisher})
                                
            # Break out of the loop if an article not from today is found
            # Every article after that will be from another day, so this improved speed
            else:
                break
                
        # Gather data
        current_article = current_article.find_next('div', 'recommended-article recommended__article first')

        # This if check is needed to not fail out when no articles are left
        if (current_article):
            current_headline = current_article.find('span', 'recommended__article-title').a.text.rstrip()
            current_excerpt = current_article.find('p', 'recommended__article-lead').text.lower()
            current_link = current_article.find('span', 'recommended__article-title').a['href']
            current_image_div = current_article.find('a', class_='recommended__article-image')
            current_image_link = current_image_div['style'].split()[1].replace("url('", '').replace("');", '')
            current_byline = current_article.find('span', class_='recommended__article-bi-line').text.lower()

            # Get the right time data based on if the article was posted over or under an hour ago
            # Get the right time data based on if the article was posted over or under an hour ago
            if re.search("\d minute", current_byline):

                # Search for double digit minutes before single digits
                # To avoid time keeping bugs
                if re.search("\d\d minute", current_byline):
                    current_time_since_posted = re.search("\d\d minute", current_byline).group()
                else:
                    current_time_since_posted = re.search("\d minute", current_byline).group()

            elif re.search("\d hour", current_byline):

                # Search for double digit hours before single digits
                # To avoid time keeping bugs
                if re.search("\d\d hour", current_byline):
                    current_time_since_posted = re.search("\d\d hour", current_byline).group()
                else:
                    current_time_since_posted = re.search("\d hour", current_byline).group()
            else:
                current_time_since_posted = "none"

    #times_file.close()

    approved_articles_copy = approved_articles.copy()

    write_to_times_file(approved_articles_copy, times_file_name)

    return approved_articles, total_articles_scraped


def scrape_nooga_today_breaking_political(url, date, category):

    # List for approved articles
    approved_articles = list()
    
    # Publisher variable
    publisher = "Nooga Today"

    #Variable for news analytics
    total_articles_scraped = 0
    
    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    # New code to work on the raspberry pi
    #chrome_options = Options()
    #chrome_options.add_argument('--headless')
    #chrome_options.BinaryLocation = '/usr/bin/chromium-browser'
    #headless_browser = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)
    
    try:

        # Open the page and load the source into a soup object
        headless_browser.get(url)

        browser_wait = WebDriverWait(headless_browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alm-reveal'))
        )

        nooga_soup = bs(headless_browser.page_source, 'lxml')

    except:
        
        headless_browser.quit()

        # return a list with a dict inside indicating the website is down or unable to be reached
        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None

    # Isolate the content section and get the first article listed
    content_section = nooga_soup.find('div', class_ = 'alm-reveal')
    current_article = content_section.find('article')

    # Priming read for the main scraping loop
    current_headline = current_article.find('h2', class_ = 'entry-title').text
    #current_excerpt = current_article.find('div', class_ = 'entry-excerpt').p.text.lower()
    current_link = current_article.find('h2', class_ = 'entry-title').a['href']
    try:
        current_image_link = current_article.find('img')['src']
    except:
        current_image_link = 'https://noogatoday.6amcity.com/wp-content/uploads/sites/9/2020/03/Untitled-design.png'
    current_date_posted = current_article.find('time')['datetime'][:10]
    current_time_posted = current_article.find('time')['datetime'][11:16]
    current_category = current_article.find('span', class_ = 'category').text.lower().strip()

    # Reformat date
    #current_year = current_date_posted[:4]
    #current_month = current_date_posted[5:7]
    #current_day = current_date_posted[8:10]
    current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    # Check if the current article is from today
    if current_date_posted == date:

        total_articles_scraped += 1
        
        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(current_date_posted, '%m/%d/%Y').date()
        current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

        # Append the current article if it is a single category post
        if re.search(',', current_category) == None and current_category == category:

            # Append to approved_articles
            approved_articles.append({'headline': current_headline,
                                      'link': current_link,
                                      'image': current_image_link,
                                      'date_posted': get_date(7),
                                      'time_posted': current_time_posted,
                                      'publisher': publisher})
            
        # For the breaking/political scraper, the city category will sometimes have multiple tags
        # I only want the city, news articles if they are from multiple categories
        # The other multiple category posts will be picked up by the other scraper
        elif re.search(',', current_category):
            if category == 'news':
                if re.search('city, news', current_category) or re.search('lifestyle, news', current_category):

                    # Append to approved_articles
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})
    else:

        # Return approved articles to break the function call if the first article isn't from today
        return approved_articles, total_articles_scraped
    
    for story in range(4):

        # Move to the next article on the page and gather info
        current_article = current_article.find_next('article')
        current_headline = current_article.find('h2', class_='entry-title').text
        #current_excerpt = current_article.find('div', class_='entry-excerpt').p.text.lower()
        current_link = current_article.find('h2', class_='entry-title').a['href']
        try:
            current_image_link = current_article.find('img')['src']
        except:
            current_image_link = 'https://noogatoday.6amcity.com/wp-content/uploads/sites/9/2020/03/Untitled-design.png'
        current_date_posted = current_article.find('time')['datetime'][:10]
        current_time_posted = current_article.find('time')['datetime'][11:16]
        current_category = current_article.find('span', class_='category').text.lower().strip()

        # Reformat date
        #current_year = current_date_posted[:4]
        #current_month = current_date_posted[5:7]
        #current_day = current_date_posted[8:10]
        current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

        # Check if the current article is from today
        if current_date_posted == date:

            total_articles_scraped += 1
            
            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
            current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

            # Append the current article if it is a single category post
            if re.search(',', current_category) == None and current_category == category:

                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                          'link': current_link,
                                          'image': current_image_link,
                                          'date_posted': get_date(7),
                                          'time_posted': current_time_posted,
                                          'publisher': publisher})
                
            # For the breaking/political scraper, the city category will sometimes have multiple tags
            # I only want the city, news articles if they are from multiple categories
            # The other multiple category posts will be picked up by the other scraper
            elif re.search(',', current_category.lower()):
                if category == 'city':
                    if re.search('city, news', current_category) or re.search('lifestyle, news', current_category):

                        # Append to approved_articles
                        approved_articles.append({'headline': current_headline,
                                                  'link': current_link,
                                                  'image': current_image_link,
                                                  'date_posted': get_date(7),
                                                  'time_posted': current_time_posted,
                                                  'publisher': publisher})

        else:

            # Break if an article from another day is found
            break
                        
    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_nooga_today_non_political(url, date, category):

    # List for approved articles and a temp list for scraping
    approved_articles = list()

    # Publisher variable
    publisher = "Nooga Today"

    # Variable for news analytics
    total_articles_scraped = 0
    
    # Load Firefox driver and set headless options
    # This is needed because channel nine loads its articles using a script upon page load
    # The browser is headless so this can run on a server command line
    firefox_options = webdriver.FirefoxOptions()
    firefox_options.headless = True
    headless_browser = Firefox(options=firefox_options)

    # New code to work on the raspberry pi
    #chrome_options = Options()
    #chrome_options.add_argument('--headless')
    #chrome_options.BinaryLocation = '/usr/bin/chromium-browser'
    #headless_browser = webdriver.Chrome(executable_path='/usr/bin/chromedriver', options=chrome_options)
    
    try:

        # Open the page and load the source into a soup object
        headless_browser.get(url)

        browser_wait = WebDriverWait(headless_browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alm-reveal'))
        )

        nooga_soup = bs(headless_browser.page_source, 'lxml')
        
    except:
        
        headless_browser.quit()

        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None
    
    # Isolate the content section and get the first article listed
    content_section = nooga_soup.find('div', class_ = 'alm-reveal')
    current_article = content_section.find('article')

    # Priming read for the main scraping loop
    current_headline = current_article.find('h2', class_ = 'entry-title').text
    #current_excerpt = current_article.find('div', class_ = 'entry-excerpt').p.text.lower()
    current_link = current_article.find('h2', class_ = 'entry-title').a['href']
    try:
        current_image_link = current_article.find('img')['src']
    except:
        current_image_link = 'https://noogatoday.6amcity.com/wp-content/uploads/sites/9/2020/03/Untitled-design.png'
    current_date_posted = current_article.find('time')['datetime'][:10]
    current_time_posted = current_article.find('time')['datetime'][11:16]
    current_category = current_article.find('span', class_='category').text.lower().strip()

    # Reformat date
    #current_year = current_date_posted[:4]
    #current_month = current_date_posted[5:7]
    #current_day = current_date_posted[8:10]
    current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    # Add the current article to the temp list if it is from today
    if current_date_posted == date:

        if current_category != 'city, news' and current_category != 'lifestyle, news':
                total_articles_scraped += 1
        
        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
        current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

        # Only append the article from the city page if it is only tagged as a city article
        # ----- START HERE -----
        # I need some way to differentiate between category types and where to post dual category stories
        if re.search(',', current_category.lower()) == None and current_category == category:

            # Append to approved_articles
            approved_articles.append({'headline': current_headline,
                                      'link': current_link,
                                      'image': current_image_link,
                                      'date_posted': get_date(7),
                                      'time_posted': current_time_posted,
                                      'publisher': publisher})
            
        # This elif will deal with multiple category posts
        # Priority for story categories is news > city > lifestyle > food and drink
        elif re.search(',', current_category.lower()):
            # This non-political and breaking news scraper will only be used for city, food/drink, and lifestyle sections
            if category == 'city':
                # if-else statements for nested categories (city, news \ city, lifestyle \ etc.
                if re.search('city, news', current_category.lower()) == None:

                    # Append to approved_articles
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})
                    
            elif category == 'food + drink':
                
                if re.search('food + drink, news', current_category.lower()):

                    # Append to approved_articles
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})
                    
                elif re.search('food + drink, lifestyle', current_category.lower()):

                    # Append to approved_articles
                    approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})

    else:

        # Return approved articles and end the function call if article is from another day
        return approved_articles, total_articles_scraped
                    
    for story in range(4):

        # Move to the next article on the page and gather info
        current_article = current_article.find_next('article')
        current_headline = current_article.find('h2', class_='entry-title').text
        #current_excerpt = current_article.find('div', class_='entry-excerpt').p.text.lower()
        current_link = current_article.find('h2', class_='entry-title').a['href']
        try:
            current_image_link = current_article.find('img')['src']
        except:
            current_image_link = 'https://noogatoday.6amcity.com/wp-content/uploads/sites/9/2020/03/Untitled-design.png'
        current_date_posted = current_article.find('time')['datetime'][:10]
        current_time_posted = current_article.find('time')['datetime'][11:16]
        current_category = current_article.find('span', class_='category').text.lower().strip()

        # Reformat date
        #current_year = current_date_posted[:4]
        #current_month = current_date_posted[5:7]
        #current_day = current_date_posted[8:10]
        current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

        # Add the current article to the temp list if it is from today
        if current_date_posted == date:

            if current_category != 'city, news' and current_category != 'lifestyle, news':
                total_articles_scraped += 1
            
            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
            current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

            # Only append the article from the city page if it is only tagged as a city article
            # ----- START HERE -----
            # I need some way to differentiate between category types and where to post dual category stories
            if re.search(',', current_category.lower()) == None and current_category == category:

                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                              'link': current_link,
                                              'image': current_image_link,
                                              'date_posted': get_date(7),
                                              'time_posted': current_time_posted,
                                              'publisher': publisher})

            # This elif will deal with multiple category posts
            # Priority for story categories is news > city > lifestyle > food and drink
            elif re.search(',', current_category.lower()):
                # This non-political and breaking news scraper will only be used for city, food/drink, and lifestyle sections
                if category == 'city':
                    # if-else statements for nested categories (city, news \ city, lifestyle \ etc.
                    if re.search('city, news', current_category.lower()) == None:

                        # Append to approved_articles
                        approved_articles.append({'headline': current_headline,
                                                  'link': current_link,
                                                  'image': current_image_link,
                                                  'date_posted': get_date(7),
                                                  'time_posted': current_time_posted,
                                                  'publisher': publisher})

                elif category == 'food + drink':
                    
                    if re.search('food + drink, news', current_category.lower()):

                        # Append to approved_articles
                        approved_articles.append({'headline': current_headline,
                                                  'link': current_link,
                                                  'image': current_image_link,
                                                  'date_posted': get_date(7),
                                                  'time_posted': current_time_posted,
                                                  'publisher': publisher})

                    elif re.search('food + drink, lifestyle', current_category.lower()):

                        # Append to approved_articles
                        approved_articles.append({'headline': current_headline,
                                                  'link': current_link,
                                                  'image': current_image_link,
                                                  'date_posted': get_date(7),
                                                  'time_posted': current_time_posted,
                                                  'publisher': publisher})

        else:

            # Break the loop if the article isn't from today
            break
                        
    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_pulse(url, date, session):

    # Lists for approved articles and scraping
    approved_articles = list()

    # Publisher variable
    publisher = "Chattanooga Pulse"

    # Variable for news analytics
    total_articles_scraped = 0

    try:
    
        # Get the HTML for the specified page and put it into a soup object
        pulse_soup = bs(session.get(url).text, 'lxml')

    except:

        # Return a list indicating the website wasn't able to be reached
        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None
        
    # The pulse pages has a main article that appears differently than the normal articles
    content_section = pulse_soup.find('div', id = 'main')
    current_article = content_section.find('div', id = 'sectionlead')

    # Get relevant information from the current article
    current_headline = current_article.find('h2').text
    current_link = current_article.find('h2').find('a')['href']
    current_article_content = get_pulse_article_content(current_link, session)
    current_image_link = current_article.find('div', class_ = 'image').find('a').find('img')['src']
    # current_date_posted is not shown on the lead article and a new bs object needs to be made to find it
    # This will be different in the main scraping article b/c all the feature articles have a <time> tag
    current_datetime = session.get(current_link)
    current_datetime = bs(current_datetime.text, 'lxml')
    current_datetime = current_datetime.find('time')['datetime']
    current_date_posted = current_datetime[:10]
    current_time_posted = current_datetime[11:16]

    # Reformat date
    #current_year = current_date_posted[:4]
    #current_month = current_date_posted[5:7]
    #current_day = current_date_posted[8:10]
    current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]
    # Append all info to temp list, and temp list to approved_articles if the article is from today and relevant
    if current_date_posted == date:

        total_articles_scraped += 1
        
        # Convert time and date posted to datetime objects
        current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
        current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

        if is_relevant_article(current_headline, current_article_content):

            # Append to approved_articles
            approved_articles.append({'headline': current_headline,
                                      'link': current_link,
                                      'image': current_image_link,
                                      'date_posted': get_date(7),
                                      'time_posted': current_time_posted,
                                      'publisher': publisher})

    else:

        # return approved_articles if the first articles isn't from today
        return approved_articles, total_articles_scraped
            
    # There are 6 articles after the lead, so the loop needs to be in range 6
    for x in range(6):

        # Get relevant information
        current_article = current_article.find_next('div', class_ = 'feature')
        current_headline = current_article.find('h3').text
        current_link = current_article.find('h3').find('a')['href']
        current_article_content = get_pulse_article_content(current_link, session)
        current_image_link = current_article.find('div', class_='image').find('a').find('img')['src']
        current_datetime = current_article.find('time')['datetime']
        current_date_posted = current_datetime[:10]
        current_time_posted = current_datetime[11:16]

        # Reformat date
        current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

        if current_date_posted == date:

            total_articles_scraped += 1
            
            # Convert time and date posted to datetime objects
            current_date_posted = datetime.strptime(current_date_posted.strip(), '%m/%d/%Y').date()
            current_time_posted = datetime.strptime(current_time_posted.strip(), '%H:%M').strftime("%H:%M")

            if is_relevant_article(current_headline, current_article_content):

                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                          'link': current_link,
                                          'image': current_image_link,
                                          'date_posted': get_date(7),
                                          'time_posted': current_time_posted,
                                          'publisher': publisher})

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

        browser_wait = WebDriverWait(headless_browser, 15).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'article-container'))
        )

        chronicle_soup = bs(headless_browser.page_source, 'lxml')
        content_section = chronicle_soup.find('div', class_='article-container')

    except:

        headless_browser.quit()

        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None

    # Isolate the content section and get the first article listed
    current_article = content_section.find('article')

    # Priming read for the main scraping loop
    current_headline = current_article.find('h2', class_='entry-title').text.strip()
    try:
        current_excerpt = current_article.find('div', class_ = 'entry-content').p.text.lower().strip()
    except:
        current_excerpt = ""
    current_link = current_article.find('h2', class_='entry-title').a['href']
    try:
        current_image_link = current_article.find('img')['src']
    except:
        current_image_link = 'http://www.chattanooga-blackpages.com/images/ChatChronicle001.jpg'
    current_datetime = current_article.find('time', class_ = 'published')['datetime']
    current_date_posted = current_datetime[:10].strip()
    current_time_posted = current_datetime[11:16]

    if int(get_date(10)[:2]) - int(current_time_posted[:2]) < 0:
        now_or_later = "later"
    else:
        now_or_later = "now"
    
    while (current_article):
        
        # for the main scraping loop
        if current_date_posted.strip() == date:

            total_articles_scraped += 1
            
            if is_relevant_article(current_headline, current_excerpt) and now_or_later=="now":
                # Append to approved_articles
                approved_articles.append({'headline': current_headline,
                                          'link': current_link,
                                          'image': current_image_link,
                                          'date_posted': get_date(7),
                                          'time_posted': current_time_posted,
                                          'publisher': publisher})

        else:
            # Break the loop if an article found is not from today
            return approved_articles, total_articles_scraped

        # Isolate the content section and get the first article listed
        current_article = current_article.find_next('article')

        if (current_article):
            # Priming read for the main scraping loop
            current_headline = current_article.find('h2', class_='entry-title').text.strip()
            try:
                current_excerpt = current_article.find('div', class_='entry-content').p.text.lower()
            except:
                current_excerpt = ""
            current_link = current_article.find('h2', class_='entry-title').a['href']
            try:
                current_image_link = current_article.find('img')['src']
            except:
                current_image_link = 'http://www.chattanooga-blackpages.com/images/ChatChronicle001.jpg'
            current_datetime = current_article.find('time', class_='published')['datetime']
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
            #current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    headless_browser.quit()

    return approved_articles, total_articles_scraped


def scrape_local_three(url, date):

    def is_meteorologist(current_author):
        meteorologists = [
            'alison pryor',
            'david karnes',
            'cedric haynes',
            'clay smith'
        ]
        mapped_list = map(lambda x: current_author in x, meteorologists)
        return sum(mapped_list) > 0

    # This list will hold boolean values to determine if articles
    # are about Chattanooga or Hamilton County
    approved_articles = list()
    all_local_articles = list()

    # Populate publisher
    publisher = "Local 3 News"

    # Variable for news analytics
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
        local_three_soup = bs(headless_browser.page_source, 'lxml')
        content_section = local_three_soup.find('div', class_ = 'row row-primary')
        current_section = content_section.find_next('div', id = 'tncms-region-index-primary-b')

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()
        
        headless_browser.quit()

        # Return a list indicating the website wasn't able to be reached
        return [{'headline': 'DOWN', 'publisher': publisher, 'date_posted': get_date(7)}], None

    # This assignment just makes the first line of the for loop work
    # Otherwise current_article.find_next wouldn't work
    current_article = current_section

    # Get the link to the current card and use the requests session to go there and evaluate
    current_article = current_article.find_next('article', class_='tnt-section-local-news')
    current_headline = current_article.find('div', class_='card-headline').a.text.strip()
    current_article_category = current_article.find('div', class_='card-label-section').a.text.strip().lower()
    current_link = links['local_three']['base'] + current_article.find('h3').a['href']
    current_datetime = current_article.find('li', class_='card-date').time['datetime']
    current_date_posted = current_datetime[:10]
    current_time_posted = current_datetime[11:16]
    # The image srcset has a ton of different sizes, so let's grab the link to the biggest and see if that scales right
    try:
        current_image_link = current_article.find('img')['srcset'].split()[-2]
    except:
        # saving this just in case
        # current_image_link = "https://pbs.twimg.com/profile_banners/25735151/1642103542/1500x500"
        current_image_link = 'https://pbs.twimg.com/profile_images/1481715996469735425/bKvaJx6s_400x400.jpg'

    # Reformat date
    current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    # Main scraping loop
    # Their story posting pattern is weird, but the first 7 or 8 are usually recent
    while current_article:

        if current_date_posted == date and current_article_category == 'local news':

            total_articles_scraped += 1

            all_local_articles.append({'headline': current_headline,
                                        'link': current_link,
                                        'image': current_image_link,
                                        'date_posted': get_date(7),
                                        'time_posted': current_time_posted,
                                        'publisher': publisher})

        else:
            break

        # Get the link to the current card and use the requests session to go there and evaluate
        current_article = current_article.find_next('article', class_='tnt-section-local-news')
        if current_article:
            current_headline = current_article.find('div', class_='card-headline').a.text.strip()
            current_article_category = current_article.find('div', class_='card-label-section').a.text.strip().lower()
            current_link = links['local_three']['base'] + current_article.find('h3').a['href']
            current_datetime = current_article.find('li', class_='card-date').time['datetime']
            current_date_posted = current_datetime[:10]
            current_time_posted = current_datetime[11:16]
            # The image srcset has a ton of different sizes, so let's grab the link to the biggest and see if that scales right
            try:
                current_image_link = current_article.find('img')['srcset'].split()[-2]
            except:
                # saving this just in case
                # current_image_link = "https://pbs.twimg.com/profile_banners/25735151/1642103542/1500x500"
                current_image_link = 'https://pbs.twimg.com/profile_images/1481715996469735425/bKvaJx6s_400x400.jpg'

            # Reformat date
            current_date_posted = current_date_posted[5:7] + '/' + current_date_posted[8:10] + '/' + current_date_posted[:4]

    for article in all_local_articles:

        headless_browser.get(article['link'])
        time.sleep(5)
        current_article_soup = bs(headless_browser.page_source, 'lxml')
        try:
            article_content = current_article_soup.find('div', itemprop = 'articleBody').text
        except AttributeError:
            try:
                article_content = current_article_soup.find('div', class_ = 'asset-content').text
                logging.info('Used asset-content div for text')
                logging.error(f'No article body for - {article["headline"]} - ')
            except AttributeError:
                logging.info(f'article content blank for {article["headline"]}')
                article_content = ''

            
        if is_relevant_article(article['headline'], article_content):

            approved_articles.append(article)

        # This accounts for weather articles that don't explicitly mention chattanooga, but they're about the region
        else:

            try:
                current_author = current_article_soup.find('span', itemprop='author').text.strip().lower()
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
    if re.search(links['youtube']['cha_guide'], url):
        publisher = "CHA Guide"
    elif re.search(links['youtube']['scenic_city_records'], url):
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
        content_section = bs(headless_browser.page_source, 'lxml')
        content_section = content_section.find('div', {'id': 'items', 'class': 'style-scope ytd-grid-renderer'})

    except:

        # Delete cookies before quitting the browser
        headless_browser.delete_all_cookies()

        headless_browser.quit()
        
        return [{'headline': ' DOWN', 'publisher': publisher, 'date_posted': get_date(7)}]

    # Priming read for the scraping loop
    current_video = content_section.find_next('ytd-grid-video-renderer')
    if current_video:
        current_video_title = current_video.find('h3').a.text
        current_link = links['youtube']['base'] + current_video.find('a', id='thumbnail')['href']
        current_image_link = current_video.find('img', id='img')['src']
        current_metadata = current_video.find('div', id='metadata-line')
        # The two metadata spans have the same class names, so two find_next statements are used here
        current_time_since_posted = current_metadata.find_next('span').find_next('span').text
        # Find hour or minute in current_time_since_posted
        if re.search('hour', current_time_since_posted):
            hour_or_minute = re.search('hour', current_time_since_posted).group()

            # Calculate current_time_posted
            current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)
        elif re.search('minute', current_time_since_posted):
            hour_or_minute = re.search('minute', current_time_since_posted).group()
            # Calculate current_time_posted
            current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)

        else:
            current_time_posted = "not today"

    while (current_video):

        # Append current video to approved articles if the video is from today
        # This scraper is different from our others since it is scraping youtube
        if current_time_posted != 'not today':
            approved_articles.append({'headline': current_video_title,
                                      'link': current_link,
                                      'image': current_image_link,
                                      'date_posted': date,
                                      'time_posted': current_time_posted,
                                      'publisher': publisher})

        # Priming read for the scraping loop
        current_video = current_video.find_next('ytd-grid-video-renderer')
        if current_video:
            current_video_title = current_video.find('h3').a.text
            current_link = links['youtube']['base'] + current_video.find('a', id='thumbnail')['href']
            current_image_link = current_video.find('img', id='img')['src']
            current_metadata = current_video.find('div', id='metadata-line')
            # The two metadata spans have the same class names, so two find_next statements are used here
            current_time_since_posted = current_metadata.find_next('span').find_next('span').text
            # Find hour or minute in current_time_since_posted
            if re.search('hour', current_time_since_posted):
                hour_or_minute = re.search('hour', current_time_since_posted).group()
                # Calculate current_time_posted
                current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)
                
            elif re.search('minute', current_time_since_posted):
                hour_or_minute = re.search('minute', current_time_since_posted).group()
                # Calculate current_time_posted
                current_time_posted = calculate_time_posted(current_time_since_posted, hour_or_minute)

            else:
                current_time_posted = "not today"


    headless_browser.quit()

    return approved_articles


def recycle_homepage(newly_found, currently_posted):

    # Sort the two lists so the oldest stories are indexed first
    newly_found = Sort(newly_found, False)
    currently_posted = Sort(currently_posted, False)

    # Make a list to return
    list_to_return = []

    # Loop through all articles and compare them for similarity
    for current_article in currently_posted:
        for new_article in newly_found:
            
            # This publisher check is the easiest way to start a similarity check
            if new_article['publisher'] == current_article['publisher']:

                # A matching headline, link, or image link will prove similarity
                # This is really only a problem with TFP articles and sometimes Channel 9
                # All Chattanoogan articles have the same image, so the last check is necessary
                if new_article['headline'].strip().lower() == current_article['headline'].strip().lower() \
                or new_article['link'] == current_article['link'] \
                or (new_article['image'] == current_article['image'] and current_article['publisher'] != "Chattanoogan"):

                    # Pop currently posted articles from the list of new articles
                    newly_found.pop(newly_found.index(new_article))

    # Add all current and remaining new articles to the list to return
    # list_to_return.extend(currently_posted)

    if len(newly_found) > 0:
        list_to_return.extend(newly_found)

    # return the list
    return list_to_return


def calculate_relevant_stats(articles, current_stats, stats):

    # Calculate the relevant stats now that the homepage has been recycled
    # This ensures the relevant article stats always match the homepage
    # TFP stats
    relevant_tfp = count_articles(articles, "Chattanooga Times Free Press (subscription required)")
    try:
        stats['relevant_tfp'] = relevant_tfp
    except:
        try:
            stats['relevant_tfp'] = current_stats['relevant_tfp']
        except:
            stats['relevant_tfp'] = 0

    # Chattanoogan stats
    relevant_chattanoogan = count_articles(articles, "Chattanoogan")
    try:
        stats['relevant_chattanoogan'] = relevant_chattanoogan
    except:
        try:
            stats['relevant_chattanoogan'] = current_stats['relevant_chattanoogan']
        except:
            stats['relevant_chattanoogan'] = 0

    # Chattanooga News Chronicle stats
    relevant_chronicle = count_articles(articles, "Chattanooga News Chronicle")
    try:
        stats['relevant_chronicle'] = relevant_chronicle
    except:
        try:
            stats['relevant_chronicle'] = current_stats['relevant_chronicle']
        except:
            stats['relevant_chronicle'] = 0

    # Fox Chattanooga stats
    relevant_fox_chattanooga = count_articles(articles, "Fox Chattanooga")
    try:
        stats['relevant_fox_chattanooga'] = relevant_fox_chattanooga
    except:
        try:
            stats['relevant_fox_chatatnooga'] = current_stats['relevant_fox_chattanooga']
        except:
            stats['relevant_fox_chattanooga'] = 0

    # Nooga Today stats
    relevant_nooga_today = count_articles(articles, "Nooga Today")
    try:
        stats['relevant_nooga_today'] = relevant_nooga_today
    except:
        try:
            stats['relevant_nooga_today'] = current_stats['relevant_nooga_today']
        except:
            stats['relevant_nooga_today'] = 0

    # Pulse stats
    relevant_pulse = count_articles(articles, "Chattanooga Pulse")
    try:
        stats['relevant_pulse'] = relevant_pulse
    except:
        try:
            stats['relevant_pulse'] = current_stats['relevant_pulse']
        except:
            stats['relevant_pulse'] = 0

    # WDEF stats
    relevant_wdef = count_articles(articles, "WDEF News 12")
    try:
        stats['relevant_wdef'] = relevant_wdef
    except:
        try:
            stats['relevant_wdef'] = current_stats['relevant_wdef']
        except:
            stats['relevant_wdef'] = 0

    # Local 3 stats
    relevant_local_three = count_articles(articles, "Local 3 News")
    try:
        stats['relevant_local_three'] = relevant_local_three
    except:
        try:
            stats['relevant_local_three'] = current_stats['relevant_local_three']
        except:
            stats['relevant_local_three'] = 0


def tweet_new_articles(article_list):

    articles = article_list.copy()
    
    # Get auth tokens from Twitter API and create Tweepy API object
    auth = tweepy.OAuthHandler(os.getenv('TWITTER_CONSUMER_KEY'), os.getenv('TWITTER_CONSUMER_SECRET'))
    auth.set_access_token(os.getenv('TWITTER_ACCESS_TOKEN'), os.getenv('TWITTER_ACCESS_SECRET'))
    api = tweepy.API(auth)

    # Last headline variable to keep duplicates from being submitted for tweets
    last_headline = ""

    # Form the tweets into seperate strings that are combined in the api call
    # Tweet articles that are passed into the function
    for current_article in articles:

        if current_article['publisher'] == 'Chattanooga Times Free Press (subscription required)':
            current_publisher = "Times Free Press"
        else:
            current_publisher = current_article['publisher']
        
        current_article['time_posted'] = current_article['time_posted'].strip()
        
        # Reformat time_posted to 12 hour format
        if int(current_article['time_posted'][:2]) > 12:
            current_time_posted = str(int(current_article['time_posted'][:2]) - 12) + ":" + current_article['time_posted'][-2:]
            AM_or_PM = 'PM'

        elif int(current_article['time_posted'][:2]) == 0:
            current_time_posted = "12:" + current_article['time_posted'][-2:]
            AM_or_PM = 'AM'

        elif int(current_article['time_posted'][:2]) == 12:
            current_time_posted = current_article['time_posted']
            AM_or_PM = 'PM'

        else:
            # I type cast the string into an int and back to a string to get rid of the leading 0 in the string 
            current_time_posted = str(int(current_article['time_posted'][:2])) + ":" +  current_article['time_posted'][-2:]
            AM_or_PM = 'AM'
            
        tweet_headline = current_article['headline']
        tweet_byline = "\n\nPublished by " + current_article['publisher'] + " at " + current_time_posted + " " + AM_or_PM + "\n\n"
        tweet_link = current_article['link']

        if current_article['headline'] != last_headline:
            # Combine strings and send tweet
            api.update_status(tweet_headline + tweet_byline + tweet_link)

        last_headline = current_article['headline']
        
    # Status message
    logging.info('** New articles tweeted **')
    #print("** New articles tweeted **")


def post_to_facebook(article_list):

    articles = article_list.copy()
    
    # make graph object and assign facebook_page_id before looping through new articles
    graph = facebook.GraphAPI(os.getenv('GRAPH_ACCESS_TOKEN'))
    page_id = os.getenv('FACEBOOK_PAGE_ID')

    # Last headline variable to keep from posting duplicated
    last_headline = ""

    # Refine publisher feature
    for current_article in articles:
        if current_article['publisher'] == 'Chattanooga Times Free Press (subscription required)':
            current_publisher = "Times Free Press"

        else:
            current_publisher = current_article['publisher']

        current_article['time_posted'] = current_article['time_posted'].strip()
        
        # Reformat time_posted to 12 hour format
        if int(current_article['time_posted'][:2]) > 12:
            current_time_posted = str(int(current_article['time_posted'][:2]) - 12) + ":" + current_article['time_posted'][-2:]
            AM_or_PM = 'PM'

        elif int(current_article['time_posted'][:2]) == 0:
            current_time_posted = "12:" + current_article['time_posted'][-2:]
            AM_or_PM = 'AM'

        elif int(current_article['time_posted'][:2]) == 12:
            current_time_posted = current_article['time_posted']
            AM_or_PM = 'PM'

        else:
            # I type cast the string into an int and back to a string to get rid of the leading 0 in the string
            current_time_posted = str(int(current_article['time_posted'][:2])) + ":" + current_article['time_posted'][-2:]
            AM_or_PM = 'AM'

        post_headline = current_article['headline']
        post_byline = "\n\nPublished by " + current_publisher + " at " + current_time_posted + " " + AM_or_PM

        message_to_post = post_headline + post_byline

        if current_article['headline'] != last_headline:
            graph.put_object(page_id, "feed", message=message_to_post, link=current_article['link'])

        last_headline = current_article['headline']

    #print("** New articles posted to Facebook **")
    logging.info('** New articles posted to Facebook **')
    

# Scraper function
async def scrape_news():

    if time.localtime()[8] == 1:
        logging.info('--- SCRAPER STARTING WITH DST ACTIVE ---')
    else:
        logging.info('--- SCRAPER STARTING WITH DST INACTIVE ---')

    # Today's news file
    today_news_file = os.path.dirname(os.path.realpath('__file__')) +'/data/' + get_date(7) + '.news'
    today_stats_file = os.path.dirname(os.path.realpath('__file__')) +'/data/' + get_date(7) + '.stats'

    logging.info('news file path: ' + today_news_file)
    logging.info('stats file path: ' + today_stats_file)

    # HTTP session to use for all scrapers
    # This should speed things up by not constantly having to open new connections for each scrape
    scraper_session = requests.Session()

    # List for our found articles
    articles = list()

    # Dictionary for stats
    stats = {
        'scraped_chattanoogan': 0,
        'relevant_chattanoogan': 0,
        'scraped_chronicle': 0,
        'relevant_chronicle': 0,
        'scraped_tfp': 0,
        'relevant_tfp': 0,
        'scraped_fox_chattanooga': 0,
        'relevant_fox_chattanooga': 0,
        'scraped_nooga_today': 0,
        'relevant_nooga_today': 0,
        'scraped_pulse': 0,
        'relevant_pulse': 0,
        'scraped_wdef': 0,
        'relevant_wdef': 0,
        'scraped_local_three': 0,
        'relevant_local_three': 0
    }

    # Load current stats if they exist
    try:
        current_stats = pickle.load(open(today_stats_file, 'rb'))
        logging.info('stats loaded from file')
    except:
        logging.info('no stats file loaded')
        current_stats = {
            'scraped_chattanoogan': 0,
            'relevant_chattanoogan': 0,
            'scraped_chronicle': 0,
            'relevant_chronicle': 0,
            'scraped_tfp': 0,
            'relevant_tfp': 0,
            'scraped_fox_chattanooga': 0,
            'relevant_fox_chattanooga': 0,
            'scraped_nooga_today': 0,
            'relevant_nooga_today': 0,
            'scraped_pulse': 0,
            'relevant_pulse': 0,
            'scraped_wdef': 0,
            'relevant_wdef': 0,
            'scraped_local_three': 0,
            'relevant_local_three': 0
        }
    
    # ---------- TIMES FREE PRESS ---------- #
    # For breaking/political section
    try:
        logging.info('TFP scraper started')

        times_breaking_articles, scraped_times_breaking = await scrape_times_free_press(links['times_free_press']['base'] + links['times_free_press']['local_news'], get_date(1), scraper_session)
        times_political_articles, scraped_times_political = await scrape_times_free_press(links['times_free_press']['base'] + links['times_free_press']['local_politics'], get_date(1), scraper_session)
        times_business_articles, scraped_times_business = await scrape_times_free_press(links['times_free_press']['base'] + links['times_free_press']['region_business'], get_date(1), scraper_session)

        tfp_articles = list()
        tfp_articles.extend(times_breaking_articles)
        tfp_articles.extend(times_political_articles)
        tfp_articles.extend(times_business_articles)
        #tfp_articles = times_breaking_articles + times_political_articles + times_business_articles

        # Put stat values into variables
        scraped_tfp = scraped_times_business + scraped_times_political + scraped_times_breaking
        if scraped_tfp < current_stats['scraped_tfp']:
            scraped_tfp = current_stats['scraped_tfp']

        relevant_tfp = len(tfp_articles)
        
        stats['scraped_tfp'] = scraped_tfp
        stats['relevant_tfp'] = relevant_tfp

        delete_dupes(tfp_articles)
        articles.extend(tfp_articles)

    except Exception as e:
        logging.error('exception caught in TFP scraper', exc_info=True)
        #print("\tException caught in TFP scraper")
        #print(e)
        #print()

        # Put stats variables into dict
        try:
            stats['scraped_tfp'] = current_stats['scraped_tfp']
            stats['relevant_tfp'] = current_stats['relevant_tfp']
        except:
            stats['scraped_tfp'] = 0
            stats['relevant_tfp'] = 0

    # ---------- CHATTANOOGAN ---------- #
    # For Breaking/Political section
    try:
        logging.info('Chattanoogan scraper started')

        chattanoogan_news_articles, scraped_chattanoogan_news = await scrape_chattanoogan(links['chattanoogan']['base'] + links['chattanoogan']['breaking'], get_date(1), scraper_session, 'b/p')
        chattanoogan_happenings_articles, scraped_chattanoogan_happenings = await scrape_chattanoogan(links['chattanoogan']['base'] + links['chattanoogan']['happenings'], get_date(1), scraper_session, 'happenings')
        chattanoogan_business_articles, scraped_chattanoogan_business = await scrape_chattanoogan(links['chattanoogan']['base'] + links['chattanoogan']['business'], get_date(1), scraper_session)
        articles.extend(chattanoogan_news_articles)
        articles.extend(chattanoogan_happenings_articles)
        articles.extend(chattanoogan_business_articles)

        # Put stats values into variables
        scraped_chattanoogan = scraped_chattanoogan_business + scraped_chattanoogan_happenings + scraped_chattanoogan_news
        relevant_chattanoogan = len(chattanoogan_business_articles) + len(chattanoogan_happenings_articles) + len(chattanoogan_news_articles)

        # Put stat variables into stats dict
        stats['scraped_chattanoogan'] = scraped_chattanoogan
        stats['relevant_chattanoogan'] = relevant_chattanoogan
        
    except Exception as e:
        logging.error('Exception caught in Chattanoogan scraper', exc_info=True)
        #print("\tException caught in Chattanoogan scraper")
        #print(e)
        #print()

        # Put stat variables into stats dict
        try:
            stats['scraped_chattanoogan'] = current_stats['scraped_chattanoogan']
            stats['relevant_chattanoogan'] = current_stats['relevant_chattanoogan']
        except:
            stats['scraped_chattanoogan'] = 0
            stats['relevant_chattanoogan'] = 0

    # ---------- FOX CHATTANOOGA ---------- #
    try:
        logging.info('Fox Chattanooga scraper started')

        fox_chattanooga_articles, scraped_fox_chattanooga = await scrape_fox_chattanooga(links['fox_chattanooga']['base'] + links['fox_chattanooga']['local_news'], get_date(6))
        articles.extend(fox_chattanooga_articles)

        relevant_fox_chattanooga = len(fox_chattanooga_articles)

        # Put the stat variables into the stats dict
        stats['scraped_fox_chattanooga'] = scraped_fox_chattanooga
        stats['relevant_fox_chattanooga'] = relevant_fox_chattanooga
        
    except Exception as e:
        logging.error('Exception caught in Fox Chattanooga scraper', exc_info=True)
        #print('\tException caught in Fox Chattanooga scraper')
        #print(e)
        #traceback.print_exc()
        #print()

        # Add existing stat variables to the dict if the stats file exists, otherwise make them 0
        try:
            stats['scraped_fox_chattanooga'] = current_stats['scraped_fox_chattanooga']
            stats['relevant_fox_chattanooga'] = current_stats['relevant_fox_chattanooga']
        except:
            stats['scraped_fox_chattanooga'] = 0
            stats['relevant_fox_chattanooga'] = 0

    os.system('pkill -f firefox')
    logging.info('Firefox pkill, RAM cleared')
        
    # ---------- WDEF ---------- #
    try:
        logging.info('WDEF scraper started')

        wdef_articles, scraped_wdef = await scrape_wdef(links['wdef']['base'] + links['wdef']['local_news'], get_date(8), scraper_session)
        articles.extend(wdef_articles)

        relevant_wdef = len(wdef_articles)

        # Add stats to dict
        stats['scraped_wdef'] = scraped_wdef
        stats['relevant_wdef'] = relevant_wdef
        
    except Exception as e:
        logging.error('Exception caught in WDEF scraper', exc_info=True)
        #print('\tException caught in WDEF scraper')
        #print(e)
        #traceback.print_exc()
        #print()

        # Try to assign the current stats, make them 0 if they aren't available
        try:
            stats['scraped_wdef'] = current_stats['scraped_wdef']
            stats['relevant_wdef'] = current_stats['relevant_wdef']
        except:
            stats['scraped_wdef'] = 0
            stats['relevant_wdef'] = 0

    # ---------- NOOGA TODAY ---------- #
    # For breaking / political section
    try:
        logging.info('Nooga Today scraper started')

        nooga_today_news_articles, scraped_nooga_today_news = await scrape_nooga_today_breaking_political(links['nooga_today']['base'] + links['nooga_today']['local_news'], get_date(1), 'news')
        nooga_today_city_articles, scraped_nooga_today_city = await scrape_nooga_today_non_political(links['nooga_today']['base'] + links['nooga_today']['city'], get_date(1), 'city')
        nooga_today_food_articles, scraped_nooga_today_food = await scrape_nooga_today_non_political(links['nooga_today']['base'] + links['nooga_today']['food_drink'], get_date(1), 'food + drink')
        articles.extend(nooga_today_news_articles)
        articles.extend(nooga_today_city_articles)
        articles.extend(nooga_today_food_articles)

        # Add stats to variables
        scraped_nooga_today = scraped_nooga_today_food + scraped_nooga_today_city + scraped_nooga_today_news
        relevant_nooga_today = len(nooga_today_food_articles) + len(nooga_today_city_articles) + len(nooga_today_news_articles)

        # Put variables in dict
        stats['scraped_nooga_today'] = scraped_nooga_today
        stats['relevant_nooga_today'] = relevant_nooga_today

    except Exception as e:
        logging.error('Exception caught in Nooga Today scraper', exc_info=True)
        #print('\tException caught in Nooga Today scraper')
        #print(e)
        #print()

        try:
            stats['scraped_nooga_today'] = current_stats['scraped_nooga_today']
            stats['relevant_nooga_today'] = current_stats['relevant_nooga_today']
        except:
            stats['scraped_nooga_today'] = 0
            stats['relevant_nooga_today'] = 0

    os.system('pkill -f firefox')
    logging.info('Firefox pkill, RAM cleared')
    # ---------- CHATTANOOGA PULSE ---------- #
    try:
        logging.info('Pulse scraper started')

        pulse_news_articles, scraped_pulse_news = await scrape_pulse(links['chattanooga_pulse']['base'] + links['chattanooga_pulse']['local_news'], get_date(1), scraper_session)
        pulse_city_articles, scraped_pulse_city = await scrape_pulse(links['chattanooga_pulse']['base'] + links['chattanooga_pulse']['city_life'], get_date(1), scraper_session)
        articles.extend(pulse_news_articles)
        articles.extend(pulse_city_articles)

        # Populate stats variables
        scraped_pulse = scraped_pulse_news + scraped_pulse_city
        relevant_pulse = len(pulse_news_articles) + len(pulse_city_articles)

        # Add stats to dict
        stats['scraped_pulse'] = scraped_pulse
        stats['relevant_pulse'] = relevant_pulse
        
    except Exception as e:
        logging.error('Exception caught in Pulse scraper', exc_info=True)
        #print('\tException caught in Pulse scraper')
        #print(e)
        #print()

        try:
            stats['scraped_pulse'] = current_stats['scraped_pulse']
            stats['relevant_pulse'] = current_stats['relevant_pulse']
        except:
            stats['scraped_pulse'] = 0
            stats['relevant_pulse'] = 0

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
        logging.info('Local 3 scraper started')

        local_three_articles, scraped_local_three = await scrape_local_three(links['local_three']['base'] + links['local_three']['local_news'], get_date(1))
        articles.extend(local_three_articles)

        relevant_local_three = len(local_three_articles)

        stats['scraped_local_three'] = scraped_local_three
        stats['relevant_local_three'] = relevant_local_three

    except Exception as e:
        logging.error('Exception caught in Local 3 News scraper', exc_info=True)
        #print('\tException caught in Local 3 News scraper')
        #print(e)
        #print()

        try:
            stats['scraped_local_three'] = current_stats['scraped_local_three']
            stats['relevant_local_three'] = current_stats['relevant_local_three']
        except:
            stats['scraped_local_three'] = 0
            stats['relevant_local_three'] = 0

    # ---------- CHA GUIDE YOUTUBE ---------- #
    # try:
    #     cha_guide_videos = scrape_youtube(links['youtube']['base'] + links['youtube']['cha_guide'], get_date(7))
    #     articles.extend(cha_guide_videos)

    # except Exception as e:
    #     print('\tException caught in CHA GUIDE scraper')
    #     print("\t##" + str(e) + "##") 
    #     print()

    #     try:
    #         stats['scraped_chronicle'] = current_stats['scraped_chronicle']
    #         stats['relevant_chronicle'] = current_stats['relevant_chronicle']
    #     except:
    #         stats['scraped_chronicle'] = 0
    #         stats['relevant_chronicle'] = 0

    # Try to open today's news file
    # The except catches the exception at the beginning of the day when no file has been made
    try:
        current_posted_articles = pickle.load(open(today_news_file, 'rb'))
    except FileNotFoundError:
        current_posted_articles = list()

    # Loop through stories to make sure time_posted isn't left as None
    # This is mostly for TFP articles
    for x in range(0, len(articles)):
        try:
            if articles[x]['time_posted'] == None and articles[x]['headline'] != 'DOWN':
                articles[x]['time_posted'] = "12:00"

        except KeyError:
            # This except statement catches and removes any dictionaries
            # that indicate a site is down
            # These should be the only things that throw an exception
            logging.info(articles[x]['publisher'] + " " + articles[x]['headline'])
            #print(articles[x]['publisher'] + " " + articles[x]['headline'])
            articles.pop(x)

        # This catches index errors that occur when publishers are down and items get popped
        # Popping items causes index errors since the for loop being used is calling range(0, len(articles))
        # it loops through the original length even if something is popped
        except IndexError:
            continue
            
    # Recycle the homepage
    if len(current_posted_articles) > 0:
        articles_to_save = recycle_homepage(articles, current_posted_articles)
    else:
        articles_to_save = articles

    # Sort our articles after the homepage and newly found articles have been merged
    articles_to_save = Sort(articles_to_save, True)    
    
    # Dump the list of articles from recycle_homepage to the .news file
    pickle.dump(articles_to_save, open(today_news_file, 'wb'))
    logging.info('articles file saved')

    # Status logs
    logging.info(str(len(articles_to_save)) + " relevant articles currently saved")
    logging.info(str(len(articles)) + " of those are newly found")
    #print("\n-- " + str(len(articles_to_save)) + " relevant articles currently saved --")
    #print("-- " + str(len(articles)) + " of those are newly found --\n")

    # This is where something like a facebook/twitter/instagram API would come in handy
    # Instagram maybe should get its own command in data_commands since those are cherry-picked
    # Figure out how to make graphics automatically for IG posts

    # This keeps firefox from taking up a ton of memory 
    os.system("pkill -f firefox")
    logging.info('Firefox pkill, RAM cleared')

    calculate_relevant_stats(articles_to_save, current_stats, stats)
    pickle.dump(stats, open(today_stats_file, 'wb'))
    logging.info('stats file saved')

    # if len(articles) > 0:
    #     try:
    #         tweet_new_articles(articles)
    #     except Exception as e:
    #         logging.error('Articles not tweeted', exc_info=True)
    #     try:
    #         post_to_facebook(articles)
    #     except Exception as e:
    #         logging.error('Articles not posted to Facebook', exc_info=True)

    logging.info('--- SCRAPER EXITING --- \n')

    return articles_to_save
            

def Sort(sub_li, to_reverse):
    # reverse = None (Sorts in Ascending order)
    # key is set to sort using second element of
    # sublist lambda has been used
    sub_li.sort(key=lambda x: x['time_posted'], reverse=to_reverse)
    return sub_li


def already_saved(entry, conn) -> bool:
    query = conn.execute("SELECT EXISTS(SELECT 1 FROM articles WHERE headline=?)", (entry['headline'],))
    var = query.fetchone()
    return var


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    finally:
        return conn


def save_articles(conn, articles):
    articles_saved = 0
    for article in articles:
        if not already_saved(article, conn):
            articles_saved += 1
            conn.execute(f'''
                        INSERT INTO articles
                        VALUES (
                            {article['headline']}, 
                            {article['image']}, 
                            {article['time_posted']}, 
                            {article['publisher']}
                        );
                        ''')
    logging.info(str(articles_saved) + " articles saved")


class DBConnection:
    db_conn = None
    db_cursor = None
    def __init__(self, db_file) -> None:
        self.db_conn = create_connection(db_file)
        self.db_cursor = self.db_conn.cursor()

    def __del__(self) -> None:
        self.db_cursor.close() 
        self.db_conn.commit()
        self.db_conn.close()

    def get_cursor(self) -> Cursor:
        return self.db_cursor

async def main():

    # Scrape news, make sqlite db connection in the meantime
    current_articles = await scrape_news()
    data_highway = DBConnection("myChattanooga.db")
    # Save new articles to database
    save_articles(data_highway.get_cursor(), current_articles)
    # Close db connection
    del data_highway
          
if __name__ == "__main__":
    asyncio.run(main())