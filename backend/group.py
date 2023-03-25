from db import get_db

class Group:
    def __init__(self, id, name):
        self.group_id = id
        self.group_name = name
        self.expense = 0

    @staticmethod
    def get(group_id):
        db = get_db()
        group = db.execute(
            "SELECT * FROM chatgroup WHERE group_id = ?", 
            (group_id,)
        ).fetchone()
        if not group:
            return None

        group = Group(
            id = group[0], name = group[1]
        )
        return group
    
    @staticmethod
    def create(id, name):
        db = get_db()
        db.execute(
            "INSERT INTO chatgroup (group_id, group_name, expense) "
            "VALUES (?, ?, 0)",
            (id, name)
        )
        db.commit()
  