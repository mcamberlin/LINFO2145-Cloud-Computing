import requests
import pytest

validB64 = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="


def test_get_product(ip):
    url = f"http://{ip}:3007/products"
    myobj = {
        "name": "thomas",
        "price": 14.99,
        "quantity": 5,
        "category": "qwewqwqe-asdsadasdasd-wqewqrewe",
        "image": f"data:image/png;base64,{validB64}",
    }

    x = requests.post(url, json=myobj)
    productId = x.json()["productId"]

    x = requests.get(f"{url}/{productId}")
    for key in myobj:
        if key == "image":
            assert x.json()["product"][key].startswith("https://")
        else:
            assert x.json()["product"][key] == myobj[key]


def test_get_product_failed(ip):
    url = f"http://{ip}:3007/products"

    x = requests.get(f"{url}/falseId")
    assert x.status_code == 404


def test_get_product_all(ip):
    url = f"http://{ip}:3007/products"
    myobj = {
        "name": "productToFind1",
        "price": 14.99,
        "quantity": 5,
        "category": "qwewqwqe-asdsadasdasd-wqewqrewe",
        "image": f"data:image/png;base64,{validB64}",
    }

    x = requests.post(url, json=myobj)

    url = f"http://{ip}:3007/products"
    myobj = {
        "name": "productToFind2",
        "price": 14.99,
        "quantity": 5,
        "category": "qwewqwqe-asdsadasdasd-wqewqrewe",
        "image": f"data:image/png;base64,{validB64}",
    }

    x = requests.post(url, json=myobj)
    productId = x.json()["productId"]

    x = requests.get(f"{url}")
    product_found = 0
    for product in x.json()["products"]:
        if product["name"] == "productToFind1" or product["name"] == "productToFind2":
            product_found += 1

    assert product_found >= 2
