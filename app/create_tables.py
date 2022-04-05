import sqlite3

statements = list()

conn = sqlite3.connect("myChattanooga.db")
curs = conn.cursor()
# TODO: change time_posted from TEXT to TIMESTAMP. Change scrapers too
articles_table_sql = """
                    CREATE TABLE articles
                    (
                        headline    TEXT PRIMARY KEY NOT NULL,
                        image       TEXT                              NOT NULL,
                        time_posted TEXT                                      ,
                        publisher   TEXT                            
                    );
                    """
statements.append(articles_table_sql)

stats_table_sql = """
                    CREATE TABLE stats
                    (
                        publisher   TEXT    PRIMARY KEY     NOT NULL,
                        scraped     TEXT                    NOT NULL,
                        relevant    TEXT                    NOT NULL,
                        date        TIMESTAMP                       
                    );
                    """
statements.append(stats_table_sql)

tfp_table_sql = """
                    CREATE TABLE tfp
                    (
                        id          TEXT    PRIMARY KEY     NOT NULL,
                        headline    TEXT                    NOT NULL,
                        time_posted TIMESTAMP               NOT NULL                
                    );
                """
statements.append(tfp_table_sql)

for statement in statements:
    curs.execute(statement)

conn.commit()
curs.close()
conn.close()