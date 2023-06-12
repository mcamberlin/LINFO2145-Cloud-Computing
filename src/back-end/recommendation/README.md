# Recommendation Service

This service is used to interract with the recommendation engine. It is used to get recommendations for a user.

## Choice of technology

The recommendation service is implemented using [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) which is a popular framework for NodeJS.

---

## RestAPI interface endpoints

### GET /recommendation/<username\>

Get the recommendation for the specified user

**Parameters**

|       Name | Required | Type   | Description   |
| ---------: | :------: | :----- | ------------- |
| `userName` | required | string | The user name |

**Response**

```
// If success

{
    "status": "success",
    "products": [
        productId,
        ...
    ]
}

```
