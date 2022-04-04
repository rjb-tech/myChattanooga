import sqlite3

statements = list()

conn = sqlite3.connect("myChattanooga.db")
curs = conn.cursor()
# TODO: change time_posted from TEXT to TIMESTAMP. Change scrapers too
articles_table_sql = """
                    CREATE TABLE articles
                    (
                        id          INTEGER     PRIMARY KEY NOT NULL,
                        headline    TEXT                    NOT NULL,
                        image       TEXT                    NOT NULL,
                        time_posted TEXT                            ,
                        publisher   TEXT                            
                    );
                    """
stats_table_sql = """
                    CREATE TABLE stats
                    (
                        publisher   TEXT    PRIMARY KEY     NOT NULL,
                        scraped     TEXT                    NOT NULL,
                        relevant    TEXT                    NOT NULL,
                        date        TIMESTAMP                       
                    );
                    """
tfp_table_sql = """
                    CREATE TABLE tfp
                    (
                        id          TEXT    PRIMARY KEY     NOT NULL,
                        headline    TEXT                    NOT NULL,
                        time_posted TIMESTAMP               NOT NULL                
                    );
                """
curs.execute(create_table_sql)
conn.commit()
conn.close()