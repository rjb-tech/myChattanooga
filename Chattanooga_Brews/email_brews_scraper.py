#!/usr/bin/python3

import re
import os
import ssl
import email
import imaplib
import smtplib
import mailparser
import subprocess
from datetime import datetime
from imapclient import IMAPClient
from bs4 import BeautifulSoup as bs
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, Text, insert

# This is a list of businesses that have been notified of this system
partners = [
    "oddstory",
    "huttonandsmith",
    "barley",
    "bitteralibi",
    "nakedriver",
    "fivewits",
    "ryne"
]


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


# Function to connect to protonmail-bridge SMTP and IMAP servers
# This will return the server connection objects
def protonmail_connect(protonmail_username, protonmail_password):

    # Create SSL context
    tls_context = ssl.create_default_context()
    tls_context.check_hostname = False
    tls_context.verify_mode=ssl.CERT_NONE

    # Connect to IMAP and SMTP server
    imap_server = imaplib.IMAP4(host='127.0.0.1', port=1143)
    smtp_server = smtplib.SMTP(host='127.0.0.1', port=1025)
    
    # Elevate connections to TLS
    imap_server.starttls(tls_context)
    smtp_server.starttls(context=tls_context)

    # Connect to servers
    imap_server.login(protonmail_username, str(protonmail_password))
    smtp_server.login(protonmail_username, str(protonmail_password))
                               
    # Return the server object
    return imap_server, smtp_server


# This function generates a filepath for the attachment as determined by the sender
def get_filepath(sender):

    # Set a default value for path_factor just in case no match is found
    path_factor = "none"
    
    # cycle through the partners list for a match
    for partner in partners:
        if re.search(partner.lower(), sender.lower()):
            path_factor = partner

    if path_factor == "none":
        path = None
    else:
        path = "/home/mychattanooga/WebApp/Chattanooga_News/static/news/images/" + path_factor

    return path


def get_business(email_address):

    for partner in partners:
        if re.search(partner.lower(), email_address.lower()):
            return partner


# This is where the emails are processed
def post_office(mail, imap_server, smtp_server, table):

    list_to_return = list()
    
    # Cycle through new messages
    for email_index in range(len(mail)):
        
        # fetch the messages and get an EmailMessage object from mailparser
        resp_code, mail_data = imap_server.fetch(mail[email_index], '(RFC822)')
        message_received = mailparser.parse_from_bytes(mail_data[0][1])
        
        # Data gathering for the current message
        current_from = message_received.from_[0][1]
        current_headline = message_received.subject

        # Debugging
        print("From: " + current_from)
        print("Headline:" + message_received.subject)

        # This is where the magic happens
        # BeautifulSoup is my best friend and saved so much work
        # Loading the html string from the email into a bs item allows for stripped strings
        #   and HTML to plain text
        message_soup = bs(message_received.text_html[0], 'lxml')

        # NOTE: Write this to a file and enclose the strings in <div> or <span> tags before hand
        # That would be the easiest way to do HTML formatting for the text body
        current_body_to_send = ""
        current_body_to_save = ""
        for string in message_soup.stripped_strings:
            current_body_to_send += str(string) + "\n\n"
            current_body_to_save += "<span>" + str(string) + "</span>\n\n"
            
        print("Current body: ")
        print(current_body_to_save)
            
        # Debugging
        print("Number of attachments: " + str(len(message_received.attachments)))

        # Subject for return mail
        message_subject = "myChattanooga Brews Submission Confirmation"
        
        # Save attachments
        # Attachments should be .png, .jpg, .jpeg, preferably png
        if len(message_received.attachments) > 0:

            # Create filepath here based on the date and the business that submitted a release
            filepath = get_filepath(current_from)

            # This is where the filename is held
            # There may need to be a loop here to account for multiple images
            # maybe always keep the attachments list index at 0 to ensure only one attachment is included
            attachment_name = message_received.attachments[0]['filename']
            
            
            # SAVE TO DATABASE HERE
            save_statement = insert(table).values(
                business_name = get_business(current_from),
                headline = current_headline,
                text_body = current_body_to_save,
                approval_status = "unapproved",
                date_received = get_date(7),
                days_to_run = 7,
                days_run = 0,
                image = attachment_name
            )
            
            # Set message text to be sent
            message_text = "Your message has been received by myChattanooga!\n\n"
            message_text = message_text + "You will find a summary of your submission below.\n"
            message_text = message_text + "This is an automated process, so please confirm the information below is correct. If you find any mistakes, please contact us at feedback@mychattanooga.app.\n\n"
            message_text = message_text + "Headline: " + current_headline + "\n\n"
            message_text = message_text + "Message: \n" + current_body_to_send
        
            message_to_send = "Subject: {}\n\n{}".format(message_subject, message_text)
            
            smtp_server.sendmail("myChattanooga Brews <brews@mychattanooga.app>", current_from, message_to_send)
                    
            if filepath:
                message_received.write_attachments(filepath)          
                print("Attachment saved to " + filepath)
            
            print("Reply sent!")
            
        else:

            # SAVE TO DATABASE HERE
            save_statement = insert(table).values(
                business_name = get_business(current_from),
                headline = current_headline,
                text_body = current_body_to_save,
                approval_status = "unapproved",
                date_received = get_date(7),
                days_to_run = 7,
                days_run = 0
            )

            message_text =\
                f'''
                Your message has been received by myChattanooga!\n\n
                You will find a summary of your submission below.\n
                This is an automated process, so please confirm the information below is correct. Please contact us at feedback@mychattan\
                ooga.app if you find any mistakes.\n\n
                Headline: {current_headline}\n\n
                Message body:\n{current_body_to_send}
                '''

            # Set message text to be sent
            # message_text = "Your message has been received by myChattanooga!\n\n"
            # message_text = message_text +  "You will find a summary of your submission.\n"
            # message_text = message_text + "This is an automated process, so please confirm the information below is correct. If you find any mistakes, please contact us at feedback@mychattanooga.app.\n\n"
            # message_text = message_text + "Headline: " + current_headline + "\n\n"
            # message_text = message_text + "Message: \n" + current_body_to_send
            
            message_to_send = "Subject: {}\n\n{}".format(message_subject, message_text)
        
            smtp_server.sendmail("myChattanooga Brews <brews@mychattanooga.app>", current_from, message_to_send)

            print("Reply sent!")

        list_to_return.append(save_statement)
            
    return list_to_return


# Main function
def main():
    
    # I need to research this object more
    meta = MetaData()

    # Table object to run commands on
    brews = Table(
        'brews', meta,
        Column('id', Integer, primary_key = True),
        Column('business_name', Text),
        Column('headline', Text),
        Column('text_body', Text),
        Column('approval_status', String(length=10)),
        Column('date_received', String(length=10)),
        Column('days_to_run', Integer),
        Column('days_run', Integer),
        Column('image', Text)
    )
    
    engine = create_engine('postgresql://postgres:' + os.environ['POSTGRESQL_PASSWORD'] +'@127.0.0.1/mychattanooga', echo = True)
    
    # This was used to create the table on first run
    #meta.create_all(engine)
    
    # Start protonmail bridge and connect to the IMAP server
    bridge_process = subprocess.run(["protonmail-bridge", "--noninteractive", "--no-window"])
    proton_imap, proton_smtp = protonmail_connect('ryneburden@protonmail.com', os.environ['PROTONMAIL_PASSWORD'])

    # Select the Brews folder within my account
    # This is where all the emails will be sent
    proton_imap.select("Folders/Brews", readonly=True)

    # Get the response code and all unread messages from the folder
    response_code, new_messages = proton_imap.search(None, "(UNSEEN)")

    # Get all found, unread message from the Brews folder
    found_mail = new_messages[0].decode().split()

    # I originally had a try except statement here, but went with an if
    # Maybe I'll change it who knows
    # This just saves some parsing time if no messages are found
    if len(found_mail) > 0:

        # Send the found mail to the post office to be sorted and responded to
        # And get a SQL statement back
        insert_statements = post_office(found_mail, proton_imap, proton_smtp, brews)

        for statement in insert_statements:
            print(statement)

            with engine.connect() as conn:
                result = conn.execute(statement)
                #conn.commit()
            
    else:
        print("No unread messages found")
        
    #bridge_process.terminate()
    
    #server.close()
    proton_imap.logout()


main()

# # I need to research this object more
# meta = MetaData()

# # Table object to run commands on
# brews = Table(
#     'brews', meta,
#     Column('id', Integer, primary_key = True),
#     Column('business_name', Text),
#     Column('headline', Text),
#     Column('text_body', Text),
#     Column('approval_status', String(length=10)),
#     Column('date_received', String(length=10)),
#     Column('days_to_run', Integer),
#     Column('days_run', Integer),
#     Column('image', Text)
# )

# engine = create_engine('postgresql://postgres:' + os.environ['POSTGRESQL_PASSWORD'] +'@127.0.0.1/mychattanooga', echo = True)

# # This was used to create the table on first run
# meta.create_all(engine)
