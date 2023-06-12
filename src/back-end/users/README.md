# Authentication Service

This service is used to provide user account and generate a *JavaScript Web Token* ([JWT](https://jwt.io/introduction)). It includes the creation of a new user and the login of an existing user.

> The returned token contains the expiration moment, the timestamp of the generation and the username information. This can be used as an expiration mechanism.

## Choice of technology

The authentication service is implemented using [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) which is a popular framework for NodeJS.
The database is implemented using [CouchDB](https://couchdb.apache.org/) which is a NoSQL database. This database is chosen because it is easy to use and it is a document database which is a good fit for the authentication service. This DB allow to have an web interface to view the users for an easy debugging.

The choice of using [JWT](https://jwt.io/introduction) is because it is a standard and it is easy to use. It is also a good choice for the authentication service because it is stateless and does not require to interact with authentication service to validate the token. This allows to scale the authentication service without any problem. The limitation of this is not having the possibility to revoke a specific token. This can be done by adding a blacklist of token in the authentication service but it is not (yet) implemented in this project.

---

## RestAPI interface endpoints

### GET /user/<username\>/<password\>

Get the token for the user with the given username and password.

**Parameters**

|       Name | Required | Type   | Description       |
| ---------: | :------: | :----- | ----------------- |
| `userName` | required | string | The user name     |
| `password` | required | string | The user password |

**Response**

```
// If credential valid

{
    "status": "success",
    "token": str of the auth token of the user
}

// If user not found or credential invalid

//404 error
{
    "status": 'error'
    "message": "Error: To fetch information of ${userName}. Reason: missing."
"
}

```

### POST /user/<username\>/<password\>

Create the specified user.

**Parameters**

|       Name | Required | Type   | Localisation | Description           |
| ---------: | :------: | :----- | :----------- | --------------------- |
| `userName` | required | string | BODY         | The new username |
| `password` | required | string | BODY         | The new password  |

**Response**

```
// If success

{
    "status": "Success",
    "token": str of the auth token of the user
}

// If failed

//409 error
{
    "status": "Error",
    "message": "Error: In the creation of user (${userName}). Reason: Document update conflict.."
}

```
