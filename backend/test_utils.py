import sqlite3
from db import get_db

def list_users():
    users = db.execute(
        "SELECT * FROM user"
    ).fetchall()
    print("List of users:")
    for user in users:
        print(user[0], user[1], user[2])

def list_groups():
    groups = db.execute(
        "SELECT * FROM chatgroup"
    ).fetchall()
    print("List of groups:")
    for group in groups:
        print(group[0], group[1])

def list_user_group():
    user_group = db.execute(
        "SELECT * FROM user_group"
    ).fetchall()
    print("List of rows in user_group table:")
    for row in user_group:
        print(row[0], row[1])

def rm_group(name):
    db.execute(
        "DELETE FROM chatgroup WHERE group_name = ?",
        (name,)
    )
    db.commit()
    print("Removed group " + name)

def rm_all_users():
    db.execute("DELETE FROM user")
    db.commit()
    print("Removed all users")

def rm_user(name):
    db.execute(
        "DELETE FROM user WHERE name = ?",
        (name,)
    )
    db.commit()
    print("Removed user " + name)

def create_user(name, email, password):
    db.execute(
        "INSERT INTO user (name, email, profile_pic, balance, password)"
        "VALUES (?, ?, 'none', 0, ?)",
        (name, email, password)
    )
    db.commit()
    print("Created user " + name)

if __name__ == "__main__":
    db = sqlite3.connect(
        "my_db",
        detect_types=sqlite3.PARSE_DECLTYPES
    )
    db.row_factory = sqlite3.Row

    #create_user("jeff", "jeff@gmail", "123")
    #create_user("Patrick", "patrick@gmail", "1234")
    list_users()
    list_groups()
    list_user_group()

    # rm_all_users()

