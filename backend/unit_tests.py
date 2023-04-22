import pytest
import sqlite3

from app import app
from db import get_db

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



def test_create_group(client, db):
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
    db.execute("DELETE FROM user_group")
    db.commit()

    response = client.post('/add_to_group', json={'user_email': 'jeff@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group != None

def test_remove_from_group(client, db):
    # db.execute(
    #     "INSERT INTO user_group (user_id, group_name) "
    #     "VALUES (?, ?)",
    #     ("1", "jeff_group")
    # )
    # db.commit()

    response = client.post('/remove_from_group', json={'user_email': 'jeff@gmail' , 'group_name': "jeff_group"})
    assert response.status_code == 200
    group = db.execute(
            "SELECT * FROM user_group WHERE group_name = 'jeff_group' AND user_email = 'jeff@gmail'"
        ).fetchone()
    assert group == None

