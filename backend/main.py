from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        response = generate_content_with_retry(model, prompt)
        if response and response.text:
             return response.text.strip()
        else:
             return "Miscellaneous"
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

import time
import random
from google.api_core import exceptions

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')

def generate_content_with_retry(model, prompt, retries=3, initial_delay=2):
    """
    Generates content with retry mechanism for rate limits (429).
    """
    delay = initial_delay
    for attempt in range(retries):
        try:
            return model.generate_content(prompt)
        except exceptions.ResourceExhausted:
            if attempt < retries - 1:
                sleep_time = delay + random.uniform(0, 1)
                print(f"Rate limit hit. Retrying in {sleep_time:.2f}s...")
                time.sleep(sleep_time)
                delay *= 2  # Exponential backoff
            else:
                raise
        except Exception as e:
             # For other exceptions we might not want to retry, or handle differently
             raise e
    return None

class ChatRequest(BaseModel):
    message: str

@app.post("/chat/")
def chat(request: ChatRequest):
    try:
        # Retry logic for chat is slightly different as it involves starting chat object
        # but the main failure point is send_message.
        # We will create a fresh chat session for simplicity in this stateless endpoint context
        # or reuse logic if we were maintaining state. 
        # Here we just wrap the send_message call.
        
        retries = 3
        delay = 2
        
        start_chat_response = None
        
        for attempt in range(retries):
            try:
                chat_session = model.start_chat(history=[])
                start_chat_response = chat_session.send_message(f"You are a helpful financial advisor. Answer this question: {request.message}")
                break
            except exceptions.ResourceExhausted:
                 if attempt < retries - 1:
                    sleep_time = delay + random.uniform(0, 1)
                    print(f"Chat Rate limit hit. Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                    delay *= 2
                 else:
                    return {"response": "I'm currently receiving too many requests. Please try again in a minute."}
            except Exception as e:
                return {"response": f"Error: {str(e)}. Please check your API key."}

        if start_chat_response:
             return {"response": start_chat_response.text}
        
        return {"response": "Service unavailable. Please try again later."}

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

