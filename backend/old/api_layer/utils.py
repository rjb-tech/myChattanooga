# https://auth0.com/blog/build-and-secure-fastapi-server-with-auth0/

import os
import jwt
from configparser import ConfigParser


def set_up():
    config = {
        "DOMAIN": os.environ["DOMAIN"],
        "API_AUDIENCE": os.environ["API_AUDIENCE"],
        "ISSUER": os.environ["ISSUER"],
        "ALGORITHMS": os.environ["ALGORITHMS"],
    }

    return config


class VerifyToken:
    """Does all the token verification using PyJWT"""

    def __init__(self, token):
        self.token = token
        self.config = set_up()

        # This gets the JWKS from a given URL and does processing so you can
        # use any of the keys available
        jwks_url = f'https://{self.config["DOMAIN"]}/.well-known/jwks.json'
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    def verify(self):
        # This gets the 'kid' from the passed token
        try:
            self.signing_key = self.jwks_client.get_signing_key_from_jwt(self.token).key
        except jwt.exceptions.PyJWKClientError as error:
            return {"status": "error", "message": error.__str__()}
        except jwt.exceptions.DecodeError as error:
            return {"status": "error", "message": error.__str__()}

        try:
            payload = jwt.decode(
                self.token,
                self.signing_key,
                algorithms=self.config["ALGORITHMS"],
                audience=self.config["API_AUDIENCE"],
                issuer=self.config["ISSUER"],
            )
        except Exception as e:
            return {"status": "error", "message": str(e)}

        return payload