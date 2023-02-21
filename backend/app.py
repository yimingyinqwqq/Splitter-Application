# The high-level structure of the google login system is cited from https://realpython.com/flask-google-login/
import json
import os
import sqlite3
from dotenv import load_dotenv

from flask import Flask, redirect, request, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
# authetification package
from oauthlib.oauth2 import WebApplicationClient

#google configuration
# Configuration
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)


from flask import Flask

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY")


if __name__ == "__main__":
    print(GOOGLE_CLIENT_ID)
    print(GOOGLE_CLIENT_SECRET)
    app.run(ssl_context="adhoc")