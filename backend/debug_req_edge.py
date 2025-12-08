import requests
import json

try:
    # Test case: Empty category and empty description
    response = requests.post(
        "http://localhost:8000/transactions/",
        json={
            "amount": 250,
            "category": "",
            "description": ""
        }
    )
    print(f"Empty Desc - Status Code: {response.status_code}")
    print(f"Empty Desc - Response Body: {response.text}")

except Exception as e:
    print(f"Error: {e}")
