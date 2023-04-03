from db import get_db

class Group:
    def __init__(self, name, expense=0):
        self.group_name = name
        self.expense = expense

    @staticmethod
    def get(group_name):
        db = get_db()
        group = db.execute(
            "SELECT * FROM chatgroup WHERE group_name = ?", 
            (group_name,)
        ).fetchone()
        if not group:
            return None

        group = Group(
            name = group[0], expense = group[1]
        )
        return group
    
    @staticmethod
    def create(name):
        db = get_db()
        db.execute(
            "INSERT INTO chatgroup (group_name, expense) "
            "VALUES (?, 0)",
            (name,)
        )
        db.commit()

    def list_members(self):
        db = get_db()
        members = db.execute(
            "SELECT user.name FROM user JOIN user_group ON user.id = user_group.user_id WHERE group_name = ?",
            (self.group_name,)
        )
        if not members:
            return None
        
        member_list = []
        for row in members:
            member_list.append(row[0])
        
        return member_list
  