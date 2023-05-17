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

        # handle empty group name
        if len(name.strip()) == 0:
            return None

        db.execute(
            "INSERT INTO chatgroup (group_name, expense) "
            "VALUES (?, 0)",
            (name,)
        )
        db.commit()
        return name
    
    def list_members(self):
        db = get_db()
        members = db.execute(
            "SELECT user.email, user.name FROM user JOIN user_group ON user.email = user_group.user_email WHERE group_name = ?",
            (self.group_name,)
        )
        if not members:
            return None
        
        member_dict = {}
        for row in members:
            member_dict[row[0]] = row[1]
        
        return member_dict
    
    def list_bills(self):
        db = get_db()
        bills = db.execute(
            "SELECT bill.bill_date FROM bill JOIN chatgroup WHERE chatgroup.group_name = ?",
            (self.group_name,)
        )
        if not bills:
            return None
        
        bills_list = []
        for row in bills:
            bills_list.append(row[0])
        
        return bills_list

    def list_bills_info(self):
        db = get_db()
        bills = db.execute(
            "SELECT bill_date, payer, bill.group_name, amount, description FROM bill JOIN chatgroup WHERE chatgroup.group_name = ?",
            (self.group_name,)
        )
        if not bills:
            return None
        
        bills_list = []
        for row in bills:
            bills_list.append([row[0], row[1], row[2], row[3], row[4]])
        
        return bills_list

  