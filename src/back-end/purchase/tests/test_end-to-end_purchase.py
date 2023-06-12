import requests
import pytest

import random


def test_post_item_to_cart(ip):
    user = "testendtoendpurchase" + str(random.randint(0, 100000))
    url = f"http://{ip}:3003/cart/{user}"

    # Add items to cart
    myobj1 = {
        "id": "1",
        "quantity": 1,
    }

    addobj1 = requests.post(url, json=myobj1)

    assert addobj1.status_code == 200

    myobj2 = {
        "id": "1",
        "quantity": 1,
    }

    addobj2 = requests.post(url, json=myobj2)
    assert addobj2.status_code == 200
    myobj3 = {
        "id": "2",
        "quantity": 3,
    }
    addobj3 = requests.post(url, json=myobj3)
    assert addobj3.status_code == 200

    # Buy items
    buyitem = requests.post(url + "/purchase")

    assert buyitem.status_code == 200

    # Check if items are in cart
    getcart = requests.get(url)

    assert getcart.status_code == 200 and getcart.json()["cart"] == []

    # Check if items are in purchase history

    getpurchasehistory = requests.get(f"http://{ip}:3003/history/{user}")

    assert (
        getpurchasehistory.status_code == 200
        and getpurchasehistory.json()["history"] != []
    )
