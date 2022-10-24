from pickle import FALSE
from database_module import MC_Connection
from typing import NamedTuple, Optional, List
import asyncio
import sqlalchemy
from result import Ok, Err, Result
from databases import Database
from datetime import datetime, date
from sqlalchemy.sql import exists, or_, select, update, insert
import os


class ArticleEntry(NamedTuple):
    headline: str
    date_posted: str
    publisher: str
    link: Optional[str] = None
    image: Optional[str] = None
    time_posted: Optional[str] = None


class StatEntry(NamedTuple):
    scraped: int
    relevant: int
    publisher: str


async def article_already_saved(
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


async def stat_already_saved(
    stat: StatEntry, table: sqlalchemy.Table, db: Database, date: str
) -> bool:
    async def get_result(db, query):
        return await db.execute(query)

    query = (
        table.select()
        .exists()
        .select()
        .where((table.c.publisher == stat.publisher) & (table.c.date_saved == date))
    )

    task = asyncio.create_task(get_result(db, query))
    done, pending = await asyncio.wait({task})
    # return True if the query has a result
    #   this returns None when the story being queried doesn't exist
    if task in done:
        return True if task.result() else False


async def save_article(
    conn: MC_Connection, article: ArticleEntry, isoString: str
) -> None:
    list_articles_saved = []
    articles_saved = 0
    table = conn.get_table("articles")
    if isinstance(table, Ok):
        table = table.unwrap()
        if not await article_already_saved(article, table, conn.get_db_obj()):
            query = table.insert().values(
                headline=article.headline,
                link=article.link,
                image=article.image,
                time_posted=article.time_posted,
                publisher=article.publisher,
                date_saved=datetime.fromisoformat(isoString),
            )
            await conn.get_db_obj().execute(query)
            articles_saved += 1
            list_articles_saved.append(article)


async def save_stat(conn: MC_Connection, entry: StatEntry, isoString: str) -> None:
    date_today = date.today()
    table = conn.get_table("stats")
    if isinstance(table, Ok):
        table = table.unwrap()
        if await stat_already_saved(entry, table, conn.get_db_obj(), date_today):
            # update stat
            query = (
                update(table)
                .where(
                    (table.c.publisher == entry.publisher)
                    & (table.c.date_saved == date_today)
                )
                .values(scraped=entry.scraped, relevant=entry.relevant)
            )
        else:
            # Update stat
            query = insert(table).values(
                scraped=entry.scraped,
                relevant=entry.relevant,
                publisher=entry.publisher,
                date_saved=datetime.fromisoformat(isoString),
            )
        try:
            await conn.get_db_obj().execute(query)
        except:
            print("Error")


def article(conn: MC_Connection):
    to_continue = True
    while to_continue:
        headline = input("Headline: ")
        if headline == "exit":
            to_continue = FALSE
        date_posted = date.fromisoformat(input("Date Posted: "))
        publisher = input("Publisher: ")
        link = input("Link: ")
        image = input("Image: ")
        time_posted = input("Time Posted")

        current_entry = ArticleEntry(
            headline=headline,
            date_posted=date_posted,
            publisher=publisher,
            link=link,
            image=image,
            time_posted=time_posted,
        )

        save_article(conn, current_entry, date_posted)
        os.system("clear")


def stat(conn: MC_Connection):
    to_continue = True
    while to_continue:
        publisher = input("Publisher: ")
        if publisher == "exit":
            to_continue = False
        relevant = input("Num Relevant: ")
        posted = input("Num Posted: ")
        date_ = date.fromisoformat(input("Date Saved: "))

        current_entry = StatEntry(
            publisher=publisher, relevant=relevant, scraped=posted
        )

        save_stat(conn, current_entry, date_)
        os.system("clear")


def main():
    to_continue = True
    mc_conn = MC_Connection()
    while to_continue:
        option = input("1) Save article \n2) Save Stats")
        os.system("clear")
        if option == "1":
            article(mc_conn)
        elif option == "2":
            stat(mc_conn)
        elif option == "exit":
            break
        else:
            continue
