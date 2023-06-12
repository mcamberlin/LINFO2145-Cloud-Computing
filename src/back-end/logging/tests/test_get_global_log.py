import requests
import pytest

def test_get_global_CartCheckedOut(ip):
    url = f"http://{ip}:3005/userlog"
    myobj = {
                "username":"thomas",
                "userEvent":{
                    "eventType":"CartCheckedOut",
                    "eventTime": 1666788707000,
                    "eventData":{
                        "items": [
                        {
                            "id": "1",
                            "image": "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/apple.jpg",
                            "price": 2.34,
                            "quantity": 1,
                            "subtotal": 2.34,
                            "category": 0
                        }
                        ]
                    }
                }
            }
    
    x = requests.post(url, json = myobj)
    
    y = requests.get(f"http://{ip}:3005/globallog/CartCheckedOut")
    
    assert x.status_code == 200
    assert y.status_code == 200
    assert len(y.json()["aggregatedLogs"]) > 0
    assert y.json()["aggregatedLogs"]["1"] > 0
     

def test_get_global_ItemViewed(ip):
    url = f"http://{ip}:3005/userlog"
    myobj = {
                "username":"thomas",
                "userEvent":{
                    "eventType":"ItemViewed",
                    "eventTime": 1666788707000,
                    "eventData":{
                        "itemId":"1"}
                }
            }
    
    x = requests.post(url, json = myobj)
    
    y = requests.get(f"http://{ip}:3005/globallog/ItemViewed")
    
    assert x.status_code == 200
    assert y.status_code == 200
    assert len(y.json()["aggregatedLogs"]) > 0
    assert y.json()["aggregatedLogs"]["1"] > 0
     