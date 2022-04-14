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
                        date        TIMESTAMP               NOT NULL                       
                    );
            
CREATE TABLE tfp
                    (
                        id          TEXT    PRIMARY KEY     NOT NULL,
                        headline    TEXT                    NOT NULL,
                        time_posted TIMESTAMP               NOT NULL                
                    );