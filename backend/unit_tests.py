import pytest
import sqlite3

from app import app
from db import get_db
from test_utils import *

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def db():
    with app.app_context():
        db = get_db()

    yield db

def test_local_register(client, db):
    if user_exist("jeff@gmail", db):
        rm_user("jeff@gmail", db)

    response = client.post('/localRegister', json={'username': 'jeff', 'email': 'jeff@gmail' , 'password': "testuser123!"})
    assert response.status_code == 200
    user = db.execute(
            "SELECT * FROM user WHERE name = 'jeff' AND email = 'jeff@gmail'"
        ).fetchone()
    assert user != None

def test_local_register_fail(client, db):
    response = client.post('/localRegister', json={'username': 'jeff', 'email': 'jeff@gmail' , 'password': "testuser123!"})
    assert response.status_code == 409
    assert response.get_json() == {'error': 'User already exists'}

def test_local_login(client, db):
    response = client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    assert response.status_code == 200

def test_local_login_fail_1(client, db):
    response = client.post('/localLogin', json={'email': 'testuser111@gmail' , 'password': "testuser123!"})
    assert response.status_code == 409
    assert response.get_json() == {'error': 'User does not exist'}

def test_local_login_fail_2(client, db):
    response = client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123"})
    assert response.status_code == 409
    assert response.get_json() == {"error": "Incorrect password"}

def test_create_group(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    db.execute("DELETE FROM chatgroup")
    db.commit()

    response = client.post('/create_group', json={'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM chatgroup WHERE group_name = ?",
            ("jeff_group",)
        ).fetchone()
    assert group != None

def test_add_to_group(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    db.execute("DELETE FROM user_group")
    db.commit()

    response = client.post('/add_to_group', json={'user_email': 'jeff@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group != None

def test_load_relevent_groups(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    response = client.get('/show_user_groups')
    assert response.status_code == 200
    assert response.get_json() == ['jeff_group']

def test_remove_from_group(client, db):
    response = client.post('/remove_from_group', json={'user_email': 'jeff@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group == None

