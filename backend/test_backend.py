import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        print(response.json())
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return False

def test_interactions():
    print("\nTesting /interactions...")
    payload = {"drugs": ["Aspirin", "Tylenol"]}
    try:
        response = requests.post(f"{BASE_URL}/interactions", json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.json())
        else:
            print("Error:", response.text)
    except Exception as e:
        print(f"Interactions Check Failed: {e}")

if __name__ == "__main__":
    if test_health():
        test_interactions()
