import requests
import pytest


def test_delete_item_success(ip):
    url = f"http://{ip}:3003/cart/testdeleteitem"
    myobj = {
        "id": "1",
        "quantity": "1",
    }

    x = requests.post(url, json=myobj)

    y = requests.put(url, json={"id": "1"})

    assert x.status_code == 200 and y.status_code == 200


def test_delete_cart(ip):
    url = f"http://{ip}:3003/cart/testdeleteitem"
    myobj = {
        "id": "1",
        "quantity": "1",
    }

    x = requests.post(url, json=myobj)
    x = requests.post(url, json=myobj)

    y = requests.delete(url)

    z = requests.get(url)
    assert (
        x.status_code == 200
        and y.status_code == 200
        and z.status_code == 200
        and z.json()["cart"] == []
    )
