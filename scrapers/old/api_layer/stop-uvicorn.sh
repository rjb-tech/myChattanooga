# https://stackoverflow.com/questions/60424390/is-there-a-way-to-kill-uvicorn-cleanly
PID="$(pgrep -f main:app)"
if [[ -n "$PID" ]]
then
    PGID="$(ps --no-headers -p $PID -o pgid)"
    kill -SIGINT -- -${PGID// /}
fi