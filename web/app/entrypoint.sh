service cron start
python3 create_tables.py
uvicorn main:app --host 0.0.0.0