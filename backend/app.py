import json
import os
import sqlite3

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
GOOGLE_CLIENT_ID = os.environ.get("228511978014-o7ju4tp1mmn5ilopud23ek8uk01qk83j.apps.googleusercontent.com", None)
GOOGLE_CLIENT_SECRET = os.environ.get("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", None)
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