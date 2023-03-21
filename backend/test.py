import sqlite3
from db import get_db

db = sqlite3.connect(
    "my_db",
    detect_types=sqlite3.PARSE_DECLTYPES
)
db.row_factory = sqlite3.Row

def list_users():
    users = db.execute(
        "SELECT * FROM user"
    ).fetchall()

    for user in users:
        print(user[0], user[1], user[2])

def rm_all_users():
    db.execute("DELETE FROM user")
    db.commit()

def rm_user(name):
    db.execute(
        "DELETE FROM user WHERE name = ?",
        (name,)
    )
    db.commit()

if __name__ == "__main__":
    list_users()

