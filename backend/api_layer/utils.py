import os
import jwt
from configparser import ConfigParser

def set_up():
    config = {
            "DOMAIN": os.environ("DOMAIN"),
            "API_AUDIENCE": os.environ("API_AUDIENCE"),
            "ISSUER": os.environ("ISSUER"),
            "ALGORITHMS": os.environ("ALGORITHMS"),
        }

    return config