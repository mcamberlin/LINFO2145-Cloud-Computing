# Purchase Service

This service is used to interact with the user's cart and the user's purchases history. It allows to add, remove, update, get the items into the user's cart. It enables to get the user's purchases history and to checkout the current cart.

## Choice of technology

The purchase service is implemented using [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) which is a popular framework for NodeJS.
The database is implemented using [CouchDB](https://couchdb.apache.org/) which is a NoSQL database. This database is chosen because it is easy to use and it is a document database which is a good fit for the purchase service. This DB allow to have an web interface to view and modify the purchase for an easy debugging.

---

## RestAPI interface endpoints

### GET /cart/<username\>

Get the cart for the specified user

**Parameters**

|       Name | Required | Type   | Description   |
| ---------: | :------: | :----- | ------------- |
| `userName` | required | string | The user name |

**Response**

```
// If success

{
    "status": "success",
    "cart": [
        productInfo,
        ...
    ]
}

// If failed

//404 error
{
    "status": 'error'
    "message": "Error: To fetch cart of user (${userName}). Reason: ${reason}."

}

```

### POST /cart/<username\>

Add the product into username 's cart. If there is no cart for user username, a new one is created.

**Parameters**

|       Name | Required | Type      | Localisation | Description                            |
| ---------: | :------: | :-------- | :----------- | -------------------------------------- |
| `userName` | required | string    | URI          | The user name                          |
|  `product` | required | `ProductInfo` | BODY         | The product to add |



**Response**

```
// If success

{
    "status": "Success",
}

// If failed

//500 error
{
    "status": "Error",
    "message": "Error: The product cannot be added into ${userName}'s cart. Reason: ${reason}."
}

```

### PUT /cart/<username\>

Remove one product from the username's cart. If the product does not exist in the cart, nothing happens.

**Parameters**

|       Name | Required | Type      | Description                                 |
| ---------: | :------: | :-------- | ------------------------------------------- |
| `userName` | required | string    | The user name                               |
|  `product` | required | `ProductInfo` | The product information to remove from cart |

**Response**

```
// If success

{
    "status": "Success"
}

// If failed

//500 error
{
    "status": 'Error'
    "message": "Error: To remove product from ${userName}'s cart. Reason: ${reason}."
}

```

### DELETE /cart/<username\>

Empty the cart of the specified user

**Parameters**

|       Name | Required | Type   | Description   |
| ---------: | :------: | :----- | ------------- |
| `userName` | required | string | The user name |

**Response**

```
// If success

{
    "status": "Success"
}

// If failed

//500 error
{
    "status": 'Error'
    "message": "Error: To empty cart of user (${userName}). Reason: ${reason}."

}

```

### GET /history/<username\>

Get the purchase history of the specified user

**Parameters**

|       Name | Required | Type   | Description   |
| ---------: | :------: | :----- | ------------- |
| `userName` | required | string | The user name |

**Response**

```
// If success

{
    "status": "Success",
    "history": [
                HistoryInfo,
                ...
                ]
}

// If no purchase found

//404 error
{
    "status": 'error'
    "message": "Error: To fetch purchase history of user (${userName}). Reason: ${reason}."

}

```

### POST /history/<username\>

Add a purchase to the user history

**Parameters**

|       Name | Required | Type      | Localisation | Description                             |
| ---------: | :------: | :-------- | :----------- | --------------------------------------- |
| `userName` | required | string    | URI          | The user name                           |
|  `history` | required | `HistoryInfo` | BODY         | The purchase information |

**History**
| Name | Required | Type | Description |
| ------: | :------: | :---------- | ------------------------------- |
| `date` | required | string | The date the purchase was made |
| `items` | required | `[Product]` | The products purchase |
| `total` | required | int | The total price  |

**Product**

|       Name | Required | Type   | Description            |
| ---------: | :------: | :----- | ---------------------- |
|       `id` | required | string | The product id         |
|    `image` | required | string | The product image      |
|    `price` | required | int    | The product price      |
| `quantity` | required | int    | The number of products |
| `subtotal` | required | int    | The subtotal price     |
| `category` | required | string | The product category   |

**Response**

```
// If success

{
    "status": "Success",
}

// If failed

//500 error
{
    "status": "Error",
    "message": "Error: The purchase cannot be added into ${userName}'s history. Reason: ${reason}."
}

```

### POST /cart/<username\>/purchase

Purchase the cart of the specified user.
This should contain the authorisation token.

**Parameters**

|       Name | Required | Type   | Localisation | Description   |
| ---------: | :------: | :----- | :----------- | ------------- |
| `userName` | required | string | URI          | The user name |

**Response**

```
// If success

{
    "status": "Success",
    "purchaseInfo": PurchaseInfo
}

// If failed

//500 error
{
    "status": "Error",
    "message": "Error: The cart of ${userName} cannot be purchased. Reason: ${reason}."
}

```
