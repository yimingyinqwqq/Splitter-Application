#The high-level structure of the google login system is cited from https://realpython.com/flask-google-login/
#Sources used: https://flask-login.readthedocs.io/en/latest
#https://flask.palletsprojects.com/en/1.0.x/tutorial/database/

import json
import os
import sqlite3
import requests
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, redirect, request, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)

#authetification package
from oauthlib.oauth2 import WebApplicationClient

#import databases
from db import init_db_command
from user import User

#google configuration
#Configuration
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)


from flask import Flask

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app)
#setup user login session manager
login_manager = LoginManager()
login_manager.init_app(app)

#initialize databases
try:
    init_db_command()
except:
    #Assume the database it's existed
    pass

#setup OAuth 2 client
client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    try:
        config = requests.get(GOOGLE_DISCOVERY_URL).json()
    except:
        print("get provider config failed")
    return config

#function to retrive users from database
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

#Home Page
@app.route("/")
def home():
    #If user is logged in
    if current_user.is_authenticated:
        return (
            #TODO: Change this
            "<p>Hello, {}! You're logged in! Email: {}</p>"
            "<div><p>Google Profile Picture:</p>"
            '<img src="{}" alt="Google profile pic"></img></div>'
            '<a class="button" href="/logout">Logout</a>'.format(
                current_user.username, current_user.email, current_user.profile_pic
            )
        )
    #If user is not logged in, display a button for login
    else:
        #TODO: Change this button appearance
        return '<a class="button" href="/login">Google Login</a>'

#User Login
@app.route("/login")
def login():
    #get authorization endpoint
    provider_config = get_google_provider_cfg()
    auth_endpoint = provider_config["authorization_endpoint"]

    auth_uri = client.prepare_request_uri(
        auth_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )

    return redirect(auth_uri)

#Get information from Google
@app.route("/login/callback")
def login_callback():
    auth_code = request.args.get("code")
    provider_config = get_google_provider_cfg()
    token_endpoint = provider_config["token_endpoint"]
    #prepare token and sent request to get the token
    token_url, headers, data = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=auth_code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=data,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )
    #Get the token
    client.parse_request_body_response(json.dumps(token_response.json()))

    #get user information from Google
    userinfo_endpoint = provider_config["userinfo_endpoint"]
    info_uri, headers, data = client.add_token(userinfo_endpoint)
    info_response = requests.get(info_uri, headers=headers, data=data)
    #verify user information
    if info_response.json().get("email_verified"):
        user_id = info_response.json()["sub"]
        email = info_response.json()["email"]
        picture = info_response.json()["picture"]
        username = info_response.json()["given_name"]
    else:
        return "User email not verified by Google.", 400
    print("here is" + user_id)
    #Create a user in database if not exist
    if not User.get(user_id):
        User.create(user_id, username, email, picture)
    #Create a user object
    user = User(id_=user_id, username=username, email=email, profile_pic=picture)
    #Begin user login session
    login_user(user)
    #Return to homepage
    return redirect(url_for("home"))

#User Logout     
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("http://localhost:3000/")

if __name__ == "__main__":
    app.run(ssl_context="adhoc", debug=True)