import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
print(f"Key found: {bool(key)}")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content("Hello")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
