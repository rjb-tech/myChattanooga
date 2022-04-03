import sqlite3

conn = sqlite3.connect("myChattanooga.db")
curs = conn.cursor()
# TODO: change time_posted from TEXT to TIMESTAMP. Change scrapers too
create_table_sql = """
                    CREATE TABLE articles
                    (
                        id          INTEGER     PRIMARY KEY     NOT NULL,
                        headline    TEXT                    NOT NULL,
                        image       TEXT                    NOT NULL,
                        time_posted TEXT                            ,
                        publisher   TEXT                            
                    );
                    """
curs.execute(create_table_sql)
conn.commit()
conn.close()