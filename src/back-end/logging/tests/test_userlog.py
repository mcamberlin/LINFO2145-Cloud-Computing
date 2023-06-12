import requests
import pytest

def test_post_userlog_sucess(ip):
    url = f"http://{ip}:3005/userlog"
    myobj = {
                "username":"thomas",
                "userEvent":{
                    "eventType":"pageViewed",
                    "eventTime": 1666788707000,
                    "eventData":{
                        "itemId":"1",
                    }
                }
            }

    x = requests.post(url, json = myobj)
    
    assert x.status_code == 200
     

def test_get_userlog_failed_404(ip):
    url = f"http://{ip}:3005/userlog/NONEXISTANT"

    x = requests.get(url)
    
    assert x.status_code == 404
    
testdata_post_failed = [
    ({}, 400), # empty body
    ({"username":"thomas"}, 400), # missing userEvent
    ({"username":"thomas", "userEvent":{}}, 400), # missing eventType
    ({"username":"thomas", "userEvent":{"eventType":"pageViewed"}}, 400), # missing eventTime
    ({"username":"thomas", "userEvent":{"eventType":"pageViewed", "eventTime": 1666788707000}}, 400), # missing eventData
]    

@pytest.mark.parametrize("payload,expected", testdata_post_failed)
def test_post_userlog_failed(payload, expected,ip):
    url = f"http://{ip}:3005/userlog"

    x = requests.post(url, json = payload)
    
    assert x.status_code == expected
