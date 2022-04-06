from database_module import (
    Article,
    MC_Connection
)

db_conn = MC_Connection()

# This function uses the SQLAlchemy engine to create tables
#   so calling .plug_in() isn't necessary
db_conn.initialize_tables()