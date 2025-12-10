from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # If using Supabase, the JWT secret is required to verify tokens.
    if not SECRET_KEY:
        print("Warning: SUPABASE_JWT_SECRET not set. Auth verification will fail.")
        raise HTTPException(status_code=500, detail="Server misconfiguration: missing JWT secret")

    try:
        # Verify the token using the Supabase JWT secret
        # Supabase tokens usually have 'aud': 'authenticated'
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError as e:
        print(f"JWT Verification Failed: {e}")
        raise credentials_exception
