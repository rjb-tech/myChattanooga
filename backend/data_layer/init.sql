CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE articles 
                    (
                        id          SERIAL  PRIMARY KEY,
                        headline    TEXT    NOT NULL,
                        link        TEXT    NOT NULL,
                        image       TEXT    NOT NULL,
                        time_posted TEXT    NOT NULL,
                        publisher   TEXT    NOT NULL,
                        date_saved  DATE    DEFAULT CURRENT_DATE
                    );

CREATE TABLE stats
                    (
                        publisher       TEXT    PRIMARY KEY             NOT NULL,
                        scraped         INTEGER                         NOT NULL,
                        relevant        INTEGER                         NOT NULL,
                        date_saved      DATE                            DEFAULT CURRENT_DATE                     
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
                        sunrise             INTEGER                         NOT NULL,
                        sunset              INTEGER                         NOT NULL,
                        wind_speed          INTEGER                         NOT NULL,
                        wind_direction      VARCHAR(3)                      NOT NULL
                    );

CREATE TABLE brews
                    (
                        headline            TEXT        PRIMARY KEY        NOT NULL,
                        id                  uuid        DEFAULT  uuid_generate_v4(),
                        publisher           VARCHAR(256)                   NOT NULL,
                        date_posted         TIMESTAMPTZ                    NOT NULL,
                        expired             BOOLEAN                        NOT NULL,
                        image_url           TEXT                           NOT NULL,
                        facebook_profile    TEXT                           NOT NULL,
                        instagram_profile   TEXT                           NOT NULL
                    );