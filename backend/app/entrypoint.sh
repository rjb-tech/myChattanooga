/etc/init.d/cron start && tail -f /var/log/cron.log
python3 create_tables.py
uvicorn main:app --host 0.0.0.0 --workers 6