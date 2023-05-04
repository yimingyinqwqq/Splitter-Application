from flask_login import UserMixin

from db import get_db

class User(UserMixin):
    def __init__(self, username, email, profile_pic=None, balance=0, password=None):
        self.username = username
        self.email = email
        self.profile_pic = profile_pic
        self.balance = balance
        self.password = password
        self.current_group = None

    #Override the Flask default get_id method to return the user's email
    def get_id(self):
           return self.email

    @staticmethod
    def get(email):
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE email = ?", 
            (email,)
        ).fetchone()
        if not user:
            return None

        user = User(
            username=user[0], email=user[1], profile_pic=user[2], balance=user[3], password=user[4]
        )
        return user

    @staticmethod
    def create(name, email, profile_pic=None, password=None):
        db = get_db()
        db.execute(
            "INSERT INTO user (name, email, profile_pic, balance, password) "
            "VALUES (?, ?, ?, 0, ?)",
            (name, email, profile_pic, password)
        )
        db.commit()

    @staticmethod
    def add_to_group(user_email, group_name):
        db = get_db()
        db.execute(
            "INSERT INTO user_group (user_email, group_name)"
            "VALUES (?, ?)",
            (user_email, group_name)
        )
        db.commit()
    
    @staticmethod
    def remove_from_group(user_email, group_name):
        db = get_db()
        db.execute(
            "DELETE FROM user_group WHERE user_email = ? AND group_name = ?",
            (user_email, group_name)
        )
        db.commit()
    
    @staticmethod
    def user_in_group(user_email, group_name):
        db = get_db()
        table = db.execute(
            "SELECT * FROM user JOIN user_group ON user.email = user_group.user_email WHERE user.email = ? AND group_name = ?",
            (user_email, group_name)
        ).fetchone()
        
        return True if table else False
    
    '''
    return: list of string(group's name)
    '''
    @staticmethod
    def load_relevent_groups (user_email):
        db = get_db()
        table = db.execute(
            "SELECT group_name FROM user JOIN user_group ON user.email = user_group.user_email WHERE user.email = ?",
            (user_email, )
        ).fetchall()
        group_list = []
        if not table:
            return None
        else:
            for group in table:
                group_list.append(group[0])

        return group_list

        
        
        