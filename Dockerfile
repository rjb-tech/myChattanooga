FROM ubuntu
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.30.0/geckodriver-v0.30.0-linux64.tar.gz
RUN [tar, -xvzf geckodriver-v0.30.0-linux64.tar.gz]
RUN [chmod, +x, geckodriver]
RUN [mv, geckodriver, /usr/bin]
RUN [apt, install, firefox]