# Product Service

This service is used to handle the products catalog and the available categories. This allows to create, update, delete, get products and categories.

## Choice of technology

The product service is implemented using [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) which is a popular framework for NodeJS.
The database is implemented using [CouchDB](https://couchdb.apache.org/) which is a NoSQL database. This database is chosen because it is easy to use and it is a document database which is a good fit for the product service. This DB allow to have an web interface to view and modify the product for an easy debugging.

The image is transfered using a [data url](https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) which is a base64 encoded string.
This allow to automatically store the image in the cloud while abstracting the credentials to the end-user.

---

## RestAPI interface endpoints

### POST /products/

Create a product

**Parameters**

|       Name | Required  | Type   | Localisation | Description                     |
| ---------: | :-------: | :----- | :----------- | ------------------------------- |
|     `name` | required  | string | BODY         | The product name                |
|    `price` | required  | number | BODY         | The product price               |
| `category` | optionnal | string | BODY         | The category of the product     |
| `quantity` | optionnal | int    | BODY         | The remaining number of products |
|    `image` | required  | string | BODY         | The image data of the product   |

> Detail about the image structure:
> The string should be as follow:
> `data:image/<png/jpg>;base64,<base64 encoded image data>`

**Response**

```
// If success

{
    "status": "Success",
    "productId": productId,
}

// If error in the POST body format
//400 error
{
    "status": "Error",
}

// If failed

//500 error
{
    "status": "Error",
}

```

### PUT /products/<productId>

Update an existing product

**Parameters**

|       Name |  Required | Type   | Localisation | Description                     |
| ---------: | --------: | :----- | :----------- | ------------------------------- |
|     `name` | optionnal | string | BODY         | The product name                |
|    `price` | optionnal | string | BODY         | The product price               |
| `category` | optionnal | string | BODY         | The category of the product     |
| `quantity` | optionnal | int    | BODY         | The number of remaining products |
|    `image` | optionnal | string | BODY         | The image data of the product   |

> Detail about the image structure:
> The string should be as follow:
> `data:image/<png/jpg>;base64,<base64 encoded image data>`

**Response**

```
// If success

{
    "status": "Success",
    "productId": productId,
}

// If error in the PUT body format or product not exist
//400 error
{
    "status": "Error",
}

// If failed

//500 error
{
    "status": "Error",
}

```

### GET /products/<productId\>

Get the product information related to the specified product.

**Parameters**

|        Name | Required | Type   | Description    |
| ----------: | :------: | :----- | -------------- |
| `productId` | required | string | The product id |

**Response**

```
// If product found

{
    "status": "success",
    "product": {
        "_id": string,
        "_rev": string,
        "name": string,
        "price": number,
        "category": string,
        "quantity": int,
        "image": string
    }
}

// If product not found

//404 error
{
    "status": 'error'
    "message": "To fetch information of product (${productId}). Reason: ${reason}."

}

```

### POST /products/<productId\>/reduceQuantity

Reduce the available quantity for this product

**Parameters**

|        Name | Required | Type   | Localisation | Description            |
| ----------: | -------: | :----- | :----------- | ---------------------- |
| `productId` | required | string | USI          | The product id         |
|  `quantity` | required | int    | BODY         | The amount to decrease |

**Response**

```
// If success

{
    "status": "success",
    "product": productId
}

// If error in quantity to decrease

//400 error
{
    "status": 'error',
    "message": 'Invalid product quantity decrease. Reason: ${reason}'

}

// If not enough stock

//409 error
{
    "status": 'error',
    "message": "Failed to decrease product with id ${productId}. Error: There is no enough remaining products."
}

// If product not found
// 404 error
{
    "status": 'error',
    "message": "Unable to fetch information of product (${productId})"
}

// If failed

// 500 error
{
    "status": 'error'
}


```

### GET /products/

Get every product information

**Response**

```
// If success

{
    "status": "success",
    "products": [
            productInfo,
            ...
        ]
}

// If failed

// 500 error
{
    "status": 'error',
    "message": "To fetch information for products. Reason: ${reason}."
}


```

### DELETE /products/<productId\>

Delete the product information for the specified product.

**Parameters**

|        Name | Required | Type   | Description    |
| ----------: | :------: | :----- | -------------- |
| `productId` | required | string | The product id |

**Response**

```
// If success

{
    "status": "success",
    "productId": productId
}

// If product not found

//404 error
{
    "status": 'error',
    "message": "To fetch information of product (${productId}). Reason: ${reason}."
}

//500 error
{
    "status": 'error'
    "message": "Failed to delete product with id ${productId}. Error: ${reason}."
}

```

### POST /categories/

Create a new category

**Parameters**

|   Name | Required | Type   | Localisation | Description       |
| -----: | :------: | :----- | :----------- | ----------------- |
| `name` | required | string | BODY         | The category name |

**Response**

```
// If success

{
    "status": "success",
    "categoryId": categoryId,
}

// If error in the post body format
//400 error
{
    "status": "Error",
}

// If failed

//500 error
{
    "status": "Error",
}

```

### PUT /categories/<categoryId>

Modify the category name of the specified category

**Parameters**

|   Name |  Required | Type   | Localisation | Description       |
| -----: | --------: | :----- | :----------- | ----------------- |
| `name` | optionnal | string | BODY         | The category name |

**Response**

```
// If success

{
    "status": "Success",
    "categoryId": categoryId,
}

// If error in the post body format or category not exist

//404 error
{
    "status": "Error",
}

// If failed

//500 error
{
    "status": "Error",
}

```

### GET /categories/<categorieId\>

Get the category information of the specified category

**Parameters**

|         Name | Required | Type   | Description     |
| -----------: | :------: | :----- | --------------- |
| `categoryId` | required | string | The category id |

**Response**

```
// If success

{
    "status": "success",
    "category": {
        "name": string,
    }
}

// If category not found

//404 error
{
    "status": 'error'
    "message": "To fetch information of product (${productId}). Reason: ${reason}."

}

```

### GET /categories/

Get every category information

**Response**

```
// If success

{
    "status": "success",
    "categories": [
            categoryInfo,
            ...
        ]
}

// If failed

//error 500
{
    "status": "error",
    "message": "To fetch information for categories. Reason: ${reason}."
}

```

### DELETE /categories/<categoryId\>

Delete the category information of the specified category.

**Parameters**

|         Name | Required | Type   | Description     |
| -----------: | :------: | :----- | --------------- |
| `categoryId` | required | string | The category id |

**Response**

```
// If success

{
    "status": "success",
    "categoryId": categoryId
}

// If category not found

//404 error
{
    "status": 'error'
    "message": "To fetch information of category (${categoryId}). Reason: ${reason}."

}

// If failed

//500 error
{
    "status": 'error'
    "message": "Failed to delete category with id ${categoryId}. Error: ${reason}."
}
```
