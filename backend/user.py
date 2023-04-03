from flask_login import UserMixin

from db import get_db

class User(UserMixin):
    def __init__(self, id_, username, email, profile_pic):
        self.id = id_
        self.username = username
        self.email = email
        self.profile_pic = profile_pic
        self.balance = 0

    @staticmethod
    def get(user_id):
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", 
            (user_id,)
        ).fetchone()
        if not user:
            return None

        user = User(
            id_=user[0], username=user[1], email=user[2], profile_pic=user[3]
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

    @staticmethod
    def add_to_group(user_id, group_name):
        db = get_db()
        db.execute(
            "INSERT INTO user_group (user_id, group_name)"
            "VALUES (?, ?)",
            (user_id, group_name)
        )
        db.commit()
    
    @staticmethod
    def remove_from_group(user_id, group_name):
        db = get_db()
        db.execute(
            "DELETE FROM user_group WHERE user_id = ? AND group_name = ?",
            (user_id, group_name)
        )
        db.commit()
    
    @staticmethod
    def user_in_group(user_id, group_name):
        db = get_db()
        table = db.execute(
            "SELECT * FROM user JOIN user_group ON user.id = user_group.user_id WHERE user.id = ? AND group_name = ?",
            (user_id, group_name)
        ).fetchone()
        
        return True if table else False
        
        