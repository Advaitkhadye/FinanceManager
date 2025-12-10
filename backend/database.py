from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()

import shutil

TRANS_DB_NAME = "finance.db"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Check if running on Vercel (or generally want safer writable path in serverless)
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        # Use /tmp for writable SQLite on Vercel/Lambda
        DB_FILE = f"/tmp/{TRANS_DB_NAME}"
        # Copy initial DB if it exists in source and not yet in /tmp
        if not os.path.exists(DB_FILE) and os.path.exists(TRANS_DB_NAME):
            shutil.copy(TRANS_DB_NAME, DB_FILE)
        SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"
    else:
        SQLALCHEMY_DATABASE_URL = f"sqlite:///./{TRANS_DB_NAME}"

# Fix for Render's Postgres URL which starts with postgres:// (SQLAlchemy needs postgresql://)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
