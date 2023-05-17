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
    # For latter tests
    client.post('/localRegister', json={'username': 'patrick', 'email': 'patrick@gmail' , 'password': "testuser1234!"})

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
    db.execute("DELETE FROM user_group WHERE group_name = 'jeff_group'")
    db.commit()

    response = client.post('/add_to_group', json={'group_name': "jeff_group"})

    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group != None

    # For latter tests
    client.post('/localLogin', json={'email': 'patrick@gmail' , 'password': "testuser1234!"})
    response = client.post('/add_to_group', json={'group_name': "jeff_group"})
    assert response.status_code == 200

def test_load_relevent_groups(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    response = client.get('/show_user_groups')
    assert response.status_code == 200
    assert response.get_json() == ['jeff_group']

def test_select_group(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    response = client.post('/select_group', json={'group_name': "jeff_group"})
    assert response.status_code == 200
    response_2 = client.get('/select_group')
    assert response_2.status_code == 200
    # assert response_2.get_json() == {'group_name': 'jeff_group'}

def test_scan_confirm(client, db):
    scan_dict = {}
    scan_dict["key1"] = {"amount": 1, "name": "item1", "price": 10}
    scan_dict["key2"] = {"amount": 2, "name": "item2", "price": 20}
    scan_dict["key3"] = {"amount": 3, "name": "item3", "price": 30}
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    client.post('/select_group', json={'group_name': "jeff_group"})

    group = db.execute(
            "SELECT * FROM user_group"
        ).fetchall()
    assert len(group) == 2

    response = client.post('/scan_confirm', json=scan_dict)
    bill = db.execute(
            "SELECT * FROM bill where group_name = 'jeff_group'"
        ).fetchone()
    
    assert bill[4] == str(scan_dict).replace("'", '"')
    assert response.status_code == 200
    

def test_show_bill_info(client, db):
    client.post('/localLogin', json={'email': 'jeff@gmail' , 'password': "testuser123!"})
    client.post('/select_group', json={'group_name': "jeff_group"})

    response = client.get('/show_bill_info')

    # Manually delete the created bill (revise this latter)
    db.execute("DELETE FROM bill WHERE group_name = 'jeff_group'")
    db.commit()

    assert response.status_code == 200
    
    bill_info = response.get_json()[0]
    assert bill_info['id'] == 1
    assert bill_info['total_amount'] == 140
    assert bill_info['items'][0] == {"name": "item1", "amount": 1, "price": 10}

def test_remove_from_group(client, db):
    response = client.post('/remove_from_group', json={'user_email': 'jeff@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group == None

    response = client.post('/remove_from_group', json={'user_email': 'patrick@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200

# TODO: Fix this test
def test_remove_group(client, db):
    db.execute("DELETE FROM chatgroup where group_name = 'jeff_group'")
    db.commit()

    group = db.execute(
            "SELECT * FROM chatgroup WHERE group_name = 'jeff_group'"
        ).fetchone()
    assert group == None
