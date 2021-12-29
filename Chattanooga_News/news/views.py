from django.shortcuts import render
#from django.http import HttpResponse
from datetime import datetime, timezone
import pickle
from django.utils import timezone

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
        return str(today.strftime("%b %-d, $Y"))
    elif format == 6:
        return today.strftime("%Y-%m-%d")
    elif format == 7:
        return str(today.strftime("%m-%d-%Y"))
    elif format == 8:
        return today.strftime("%H:%M")

# Python code to sort the tuples using second element
# of sublist Inplace way to sort using sort()
def Sort(sub_li, to_reverse):
    # reverse = None (Sorts in Ascending order)
    # key is set to sort using second element of
    # sublist lambda has been used
    sub_li.sort(key=lambda x: x['time_posted'], reverse=to_reverse)
    return sub_li

def home(request):

    stories = load_stories()

    context = {
        'stories': stories
    }

    # the render function looks for files in the templates folder
    return render(request, 'news/generate_stories.html', context)

def faq(request):
    # the render function looks for files in the templates folder
    return render(request, 'news/faq.html', {'title': 'FAQ'})

def stats(request):

    today_stats_file = '/home/mychattanooga/data/' + get_date(7) + '.stats'

    stats = pickle.load(open(today_stats_file, 'rb'))

    context = {
        'stats': stats,
        'title': "Stats"
    }

    return render(request, 'news/stats.html', context)

def newsletter_gen(request):

    stories = load_stories()

    context = {
        'stories': stories,
        'date_today': get_date(2)
    }

    return render(request, 'news/newsletter_generator.html', context)

def brews(request):

    return render(request, 'news/brews.html', {'title': 'Brews'})

# def newsletter_signup(request):

#     return render(request, 'news/newsletter_signup.html')

def load_stories():

    today_news_filename = '/home/mychattanooga/data/' + get_date(7) + '.news'

    news_data = pickle.load(open(today_news_filename, 'rb'))

    stories = list()

    for story in news_data:
        
        # Calculate time_since_posted and add it to the story dictionary
        story['time_since_posted'] = calculate_time_since_posted(story['time_posted'])

        # Only append the story if it doesn't have the 'f' flag
        if (story['time_since_posted']) != "f":
            stories.append(story)

    # Return stories to use as context for the home page
    return stories

def calculate_time_since_posted(story_time):

    # Get the current time
    current_time = get_date(8)

    # Calculate how many hours/minutes ago the current story was posted
    hours_since_posted = int(current_time[:2]) - int(story_time[:2])
    minutes_since_posted = int(current_time[3:]) - int(story_time[3:])
    
    # Sometimes the Chattanooga posts articles that have a time in the future
    # That obviously causes problems here, so I return a flag that is evaulated in load_stories
    if hours_since_posted < 0:
        return "f"

    # This performs the math for posts that were published less than an hour ago, but the hours_since_posted variable is 1
    # For example, something posted at 11:30 would show as published over an hour ago at 12:00
    # Negative minutes means subtract an hour and add the negative minutes to 60
    if minutes_since_posted < 0:
        hours_since_posted = hours_since_posted - 1
        if hours_since_posted < 0:
            hours_since_posted = 0
        minutes_since_posted = 60 + minutes_since_posted

    # Return case for less than an hour posted
    # This adds minutes instead of hours to the returned string
    if hours_since_posted == 0:
        return "Published " + str(minutes_since_posted) + " minutes ago"

    # Return statements for hours ago
    else:
        if hours_since_posted > 1:
            return "Published over " + str(hours_since_posted) + " hours ago"
        else:
            return "Published over " + str(hours_since_posted) + " hour ago"
