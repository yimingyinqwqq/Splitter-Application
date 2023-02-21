from flask_login import UserMixin

from db import get_db

class User(UserMixin):
    def __init__(self, id_, username, email, profile_pic, balance):
        self.id = id_
        self.username = username
        self.email = email
        self.profile_pic = profile_pic
        self.balance = balance

    @staticmethod
    def get(user_id):
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", 
            (user_id)
        ).fetchone()
        if not user:
            return None

        user = User(
            id_=user[0], name=user[1], email=user[2], profile_pic=user[3], balance=user[4]
        )
        return user

    @staticmethod
    def create(id_, name, email, profile_pic):
        db = get_db()
        db.execute(
            "INSERT INTO user (id, name, email, profile_pic, balance) "
            "VALUES (?, ?, ?, ?, 0)",
            (id_, name, email, profile_pic)
        )
        db.commit()