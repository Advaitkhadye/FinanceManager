import os
import socket
from dotenv import load_dotenv

load_dotenv()

print("--- Diagnostics ---")
# Check API Key
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"API Key found: Yes (Length: {len(api_key)})")
else:
    print("API Key found: No (Ensure GEMINI_API_KEY is in .env)")

# Check DB
if os.path.exists("finance.db"):
    print("finance.db exists")
    if os.access("finance.db", os.W_OK):
        print("finance.db is writable")
    else:
        print("finance.db is NOT writable")
else:
    print("finance.db does NOT exist")

# Check Port 8000
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('127.0.0.1', 8000))
if result == 0:
    print("Port 8000 is open (something is running)")
else:
    print("Port 8000 is closed (nothing running)")
sock.close()

print("--- End Diagnostics ---")
