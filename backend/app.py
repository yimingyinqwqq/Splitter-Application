#The high-level structure of the google login system is cited from https://realpython.com/flask-google-login/
#Sources used: https://flask-login.readthedocs.io/en/latest
#https://flask.palletsprojects.com/en/1.0.x/tutorial/database/

import json
import os
import sqlite3
import requests
import random
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask, jsonify, redirect, request, url_for
from flask_bcrypt import Bcrypt
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
import pytesseract
import cv2
import utilities

# config pytestseract
# pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
options = "--psm 4"

#authetification package
from oauthlib.oauth2 import WebApplicationClient

#import databases
from db import init_db_command
from user import User
from group import Group
from bill import Bill

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
CORS(app, supports_credentials=True)
#setup user login session manager
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)

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
def load_user(user_email):
    return User.get(email=user_email)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

#Home Page
@app.route("/home", methods = ['GET'])
def home():
    #If user is logged in
    if current_user.is_authenticated:
        user_info = jsonify({"username": current_user.username,
                             "email": current_user.email})
        return user_info, 200
        #return redirect("http://localhost:3000")

    #If user is not logged in, display a button for login
    else:
        #TODO: Change this button appearance
        return jsonify({"error": "User not logged in"}), 200
        #return redirect(url_for("login"))

#Local user register
@app.route("/localRegister", methods=["POST"])
def register_user():
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]

    user = User.get(email)

    if user:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)

    User.create(name=username, email=email, password=hashed_password)

    return "200"

#Local user login
@app.route("/localLogin", methods=["POST"])
def local_login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.get(email)

    if not user:
        return jsonify({"error": "User does not exist"}), 409

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 409

    login_user(user)

    return "200"

#User Login
@app.route("/googleLogin", methods=["POST"])
def login():
    #get authorization endpoint
        # provider_config = get_google_provider_cfg()
        # auth_endpoint = provider_config["authorization_endpoint"]

        # auth_uri = client.prepare_request_uri(
        #     auth_endpoint,
        #     redirect_uri=request.base_url + "/callback",
        #     scope=["openid", "email", "profile"],
        # )

        # return jsonify({"uri": auth_uri}), 200 
    #return redirect(auth_uri)
    #return redirect(url_for("home"))

    #New version
    username = request.json["username"]
    email = request.json["email"]
    picture = request.json["picture"]

    user = User.get(email)

    if not user:
        User.create(name=username, email=email, profile_pic=picture)
        user = User.get(email)

    login_user(user)

    return "200"


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
        email = info_response.json()["email"]
        picture = info_response.json()["picture"]
        username = info_response.json()["given_name"]
    else:
        return "User email not verified by Google.", 400

    user = User.get(email)
    if not user:
        User.create(name=username, email=email, profile_pic=picture)
    else:
        login_user(user)

    return redirect(url_for("home"))

#User Logout     
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return "200"

# extract receipt information
# TODO Need to be tested when connected with frontend
# extract receipt information
@app.route("/scan", methods = ['POST'])
def scan_receipt():
    # assume the image get from the client is
    # a list that contains RBG values 
    receipt_img_binary = request.files['receipt'].read()
    img = Image.open(BytesIO(receipt_img_binary))
    results = ((pytesseract.image_to_string(img,
                config=options, lang='eng'))).split('\n')
      
    outputs = []
    for index, product in enumerate(results):
        results[index] = product.split(' ')
        # Walmart receipt's items have at least 3 columns (name, quantity, price)
        if len(results[index]) >= 3:
            processed_line = utilities.parsing_lang(results[index])
            if processed_line:
                outputs.append(utilities.parsing_lang(results[index]))

    # print(outputs)
    return jsonify(receipt_text = outputs)

#Create a new group
@app.route("/create_group", methods = ['POST'])
def create_group():
    group_name = request.json["group_name"]
    if Group.get(group_name) != None:
        return jsonify({"error": "Group already exists"}), 409
    Group.create(group_name)
    return "200"

#Add user to group
@app.route("/add_to_group", methods = ['POST'])
def add_user_to_group():
    user_email = request.json["user_email"]
    group_name = request.json["group_name"]
    #Check if user and group exists
    if User.get(user_email) == None:
        return jsonify({"error": "User not exist"}), 409
    if Group.get(group_name) == None:
        return jsonify({"error": "Group not exist"}), 409

    User.add_to_group(user_email, group_name)
    return "200"

#Remove user from group
@app.route("/remove_from_group", methods = ['POST'])
def remove_user_from_group():
    user_email = request.json["user_email"]
    group_name = request.json["group_name"]
    #Check if user and group exists
    if User.get(user_email) == None:
        return jsonify({"error": "User not exist"}), 409
    if Group.get(group_name) == None:
        return jsonify({"error": "Group not exist"}), 409
    if not User.user_in_group(user_email, group_name):
        return jsonify({"error": "User is not in the group"}), 409
    
    User.remove_from_group(user_email, group_name)
    return "200"

#Show group members
@app.route("/show_members", methods = ['GET'])
def list_members():
    group_name = request.json["group_name"]
    #Check if group exist
    group = Group.get(group_name)
    if group == None:
        return jsonify({"error": "Group not exist"}), 409
    
    member_list = group.list_members()
    return jsonify(member_list)

#Create a new bill
@app.route("/create_bill", methods = ['POST'])
def create_bill():
    bill_name = request.json["bill_name"]
    if Bill.get(bill_name) != None:
        return jsonify({"error": "Bill already exists"}), 409
    Bill.create(bill_name)
    return "200"

#Show all bills in a group
@app.route("/show_bill", methods = ['POST'])
def list_bills():
    group_name = request.json["group_name"]
    #Check if group exist
    group = Group.get(group_name)
    if group == None:
        return jsonify({"error": "Group not exist"}), 409
    
    bill_list = group.list_bills()
    return jsonify(bill_list)

if __name__ == "__main__":
    app.run(ssl_context="adhoc", debug=True)