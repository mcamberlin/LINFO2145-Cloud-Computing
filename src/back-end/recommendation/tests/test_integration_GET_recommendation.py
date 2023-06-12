import requests
import pytest
import random



def test_get_recommendation(ip):
    url = f"http://{ip}:3009/recommendation/testuser"

    x = requests.get(url)

    print(x.json())

    assert x.status_code == 200
    
    assert len(x.json()["products"]) == 3
    assert type(x.json()["products"][0]) == str

