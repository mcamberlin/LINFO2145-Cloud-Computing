# Logging Service

This service is used to handle logging. The logging include performance metric for microservices and user log.

The user logs include the following:

-   ItemViewed
-   ItemAddedToCart
-   ItemRemovedFromCart
-   CartCheckedOut

The performance metrics include the time to respond to a request.

This service is also used to get the information for a specific user or the global users product behaviour.
In case of type of user log and to use them in the recommendation engine, please create the view corresponding to the log type in the database and name it either 'global_<eventType\>' or 'user_<eventType\>'.

## Choice of technology

The logging service is implemented using [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) which is a popular framework for NodeJS.
The database is implemented using [CouchDB](https://couchdb.apache.org/) which is a NoSQL database. This database is chosen because it is easy to use and it is a document database which is a good fit for the logging service. This DB allow to have an web interface to view the logs for an easy debugging.

---

## RestAPI interface endpoints

### POST /userlog/

Log an user event.

This should contain the authorisation token.

**Parameters**

|        Name | Required | Type        | Localisation | Description                          |
| ----------: | :------: | :---------- | :----------- | ------------------------------------ |
|  `username` | required | string      | BODY         | The user name                        |
| `userEvent` | required | `userEvent` | BODY         | The object describing the user event |

**userEvent**

|                        Name | Required  | Type   | Description           |
| --------------------------: | :-------: | :----- | --------------------- |
|                 `eventType` | required  | string | The type of event     |
|                 `eventTime` | required  | int    | The unix timestamp    |
|                 `eventData` | required  | object | The data of the event |
| `eventData.productViewedId` | optionnal | str    | The product viewed    |
|      `eventData.pageLoaded` | optionnal | str    | The page Loaded       |

**Response**

```
// If success

{
    "status": "Success",
}

// If not valid token

//401 error
{
    "status": "Error",
}

// If failed

//500 error
{
    "status": "Error",
}

```

### POST /servicelog/

Post log related to a service event.

**Parameters**

|           Name | Required | Type           | Localisation | Description                             |
| -------------: | :------: | :------------- | :----------- | --------------------------------------- |
|  `serviceName` | required | string         | BODY         | The serviceName                         |
|   `eventLevel` | required | string         | BODY         | INFO,DEBUG,WARNING,ERROR                |
| `serviceEvent` | required | `serviceEvent` | BODY         | The object describing the service event |

**serviceEvent**

|        Name | Required | Type   | Description           |
| ----------: | :------: | :----- | --------------------- |
| `eventType` | required | string | The type of event     |
| `eventTime` | required | int    | The unix timestamp    |
| `eventData` | required | object | The data of the event |

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
}

```


### GET /servicelog/<serviceName\>

Get the service log for the specified service

**Parameters**

|          Name | Required | Type   | Description      |
| ------------: | :------: | :----- | ---------------- |
| `serviceName` | required | string | The service name |

**Response**

```
// If service found

{
    "status": "success",
    "logs": [
            serviceEvent
            ...
        ]
}

// If service not found

//404 error
{
    "status": 'error'
    "message": "Error: To fetch information of service (${serviceName}). Reason: missing."

}

```

### GET /globallog/<eventType\>

Get the information for the specified event type related to all user interaction.

Example of event type: ItemViewed, CartCheckedOut

**Parameters**

|        Name | Required | Type   | Description    |
| ----------: | :------: | :----- | -------------- |
| `eventType` | required | string | The event type |

**Response**

```
// If user found

{
    "status": "success",
    "eventType": eventType,
    "aggregatedLogs": {
        "productId": count
    }
}

```

### GET /userlog/<username\>/<eventType\>

Get the information for the specified event type related to the specified user.


Example of event type: ItemViewed, CartCheckedOut, ItemAddedToCart, ItemRemovedFromCart


**Parameters**

|        Name | Required | Type   | Description    |
| ----------: | :------: | :----- | -------------- |
|  `userName` | required | string | The user name  |
| `eventType` | required | string | The event type |


**Response**

```
// If user found

{
    "status": "success",
    "eventType": eventType,
    "aggregatedLogs": {
        "productId": count
    }
}


```
