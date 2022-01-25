#!/usr/bin/python3

import os
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, Text, insert, select, update

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

    # Select all unapproved stories and decide whether to appove them or not
    select_statement = select(brews).where(brews.c.approval_status == 'unapproved')

    print(select_statement)
    print()

    query_results = list()
    
    with engine.connect() as conn:
        for row in conn.execute(select_statement):
            query_results.append(dict(row))
            
    print("There are " + str(len(query_results)) + " unapproved stories")
    print()
    input("Press enter to continue")
    
    for result in query_results:

        os.system("clear")
        print("ID: \n" + str(result["id"]))
        print("\nBusiness: \n" + str(result["business_name"]))
        print("\nHeadline: \n" + str(result["headline"]))
        print("\nBody: \n" + str(result["text_body"]))

        to_approve = input("Approve this press release? (y/n): ")
        if to_approve.lower() == "y":
            approve_statement = update(brews).where(brews.c.id==result["id"]).values(approval_status="approved")
            with engine.connect() as conn:
                conn.execute(approve_statement)
                print()
                print("Story approved")
                print()

        else:
            print("\nStory not approved\n")
            
main()
