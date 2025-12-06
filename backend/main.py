from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Finance Manager API"}

def predict_category(description: str) -> str:
    try:
        prompt = f"""
        Categorize the following transaction description into one of these categories: 
        Food, Transport, Entertainment, Housing, Utilities, Income, Shopping, Health, Education, Miscellaneous.
        
        Description: "{description}"
        
        Return ONLY the category name.
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return "Miscellaneous"

@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    if not transaction.category:
        transaction.category = predict_category(transaction.description or "")
    
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}

@app.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

class ChatRequest(BaseModel):
    message: str

@app.post("/chat/")
def chat(request: ChatRequest):
    try:
        chat = model.start_chat(history=[])
        response = chat.send_message(f"You are a helpful financial advisor. Answer this question: {request.message}")
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error: {str(e)}. Please check your API key."}


@app.get("/profile/", response_model=schemas.UserProfile)
def get_user_profile(db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile(initial_balance=5000.0)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/profile/", response_model=schemas.UserProfile)
def update_user_profile(profile: schemas.UserProfileUpdate, db: Session = Depends(get_db)):
    db_profile = db.query(models.UserProfile).first()
    if not db_profile:
        db_profile = models.UserProfile(initial_balance=profile.initial_balance)
        db.add(db_profile)
    else:
        db_profile.initial_balance = profile.initial_balance
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

