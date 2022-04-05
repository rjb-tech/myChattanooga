
import sqlite3


class Connection:
    db_conn = None
    db_cursor = None

    def __init__(self, db_file) -> None:
        self.db_conn = create_connection(db_file)
        self.db_cursor = self.db_conn.cursor()

    def __del__(self) -> None:
        self.db_cursor.close()
        self.db_conn.commit()
        self.db_conn.close()

    def get_cursor(self) -> sqlite3.Cursor:
        return self.db_cursor

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    finally:
        return conn