from db import get_db

class Bill:
    def __init__(self, id, name, creator, group_name, date, amount, num_splitter):
        self.bill_id = id
        self.bill_name = name
        self.date = date
        self.creator = creator
        self.group_name = group_name
        self.amount = amount
        self.num_splitter = num_splitter

    @staticmethod
    def get(bill_id):
        db = get_db()
        bill = db.execute(
            "SELECT * FROM bill WHERE bill_id = ?", 
            (bill_id,)
        ).fetchone()
        if not bill:
            return None

        bill = Bill(
            id = bill[0], name = bill[1], creator = bill[2], group_name = bill[3], date = bill[4], amount = bill[5], num_splitter = bill[6]
        )
        return bill
    
    @staticmethod
    def create(id, name, creator, group_name, date, amount, num_splitter):
        db = get_db()
        db.execute(
            "INSERT INTO chatgroup (bill_id, bill_name, date, creator, group_name, amount, num_splitter)"
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (id, name, creator, group_name, date, amount, num_splitter)
        )
        db.commit()