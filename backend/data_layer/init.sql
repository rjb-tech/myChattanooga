CREATE TABLE articles 
                    (
                        id          SERIAL  PRIMARY KEY,
                        headline    TEXT    NOT NULL,
                        link        TEXT    NOT NULL,
                        image       TEXT    NOT NULL,
                        time_posted TEXT    NOT NULL,
                        publisher   TEXT    NOT NULL
                    );

CREATE TABLE stats
                    (
                        publisher   TEXT    PRIMARY KEY     NOT NULL,
                        scraped     TEXT                    NOT NULL,
                        relevant    TEXT                    NOT NULL,
                        date        TIMESTAMPTZ             NOT NULL                       
                    );
            
CREATE TABLE tfp
                    (
                        id          TEXT    PRIMARY KEY     NOT NULL,
                        headline    TEXT                    NOT NULL,
                        time_posted TIMESTAMPTZ             NOT NULL                
                    );

CREATE TABLE weather
                    (
                        weather_location    VARCHAR(50)    PRIMARY KEY      NOT NULL,
                        temp                REAL                            NOT NULL,
                        humidity            REAL                            NOT NULL,
                        weather_code        INTEGER                         NOT NULL,
                        weather_description TEXT                            NOT NULL,
                        sunrise             TIMESTAMPTZ                     NOT NULL,
                        sunset              TIMESTAMPTZ                     NOT NULL,
                        wind_speed          INTEGER                         NOT NULL,
                        wind_direction      INTEGER                         NOT NULL
                    );