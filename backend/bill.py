from db import get_db

class Bill:
    def __init__(self, date, creator, group_name, amount, description):
        self.date = date
        self.creator = creator
        self.group_name = group_name
        self.amount = amount
        self.description = description

    @staticmethod
    def get(bill_date):
        db = get_db()
        bill = db.execute(
            "SELECT * FROM bill WHERE bill_date = ?", 
            (bill_date,)
        ).fetchone()
        if not bill:
            return None

        bill = Bill(
            date = bill[0], creator = bill[1], group_name = bill[2], amount = bill[3], description=bill[4]
        )
        return bill
    
    @staticmethod
    def create(date, creator, group_name, amount, description):
        db = get_db()
        db.execute(
            "INSERT INTO chatgroup (date, creator, group_name, amount,  description) "
            "VALUES (?, ?, ?, ?, ?)",
            (date, creator, group_name, amount, description)
        )
        db.commit()