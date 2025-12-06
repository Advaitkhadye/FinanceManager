from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Transaction

SQLALCHEMY_DATABASE_URL = "sqlite:///./finance.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

t = db.query(Transaction).order_by(Transaction.id.desc()).first()
if t:
    print(f"LAST: ID: {t.id}, Amount: {t.amount}, Category: '{t.category}', Description: '{t.description}'")
else:
    print("No transactions found")
