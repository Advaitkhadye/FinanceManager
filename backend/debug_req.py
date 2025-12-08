import requests
import json

try:
    response = requests.post(
        "http://localhost:8000/transactions/",
        json={
            "amount": 100,
            "category": "",
            "description": "Test transaction"
        }
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
