var userLogs = require('nano')(process.env.DB_URL_USERS)
var servicesLogs = require('nano')(process.env.DB_URL_SERVICES)


function createUserLog(log) {
    //Insert the log into the corresponding database

    return new Promise((resolve, reject) => {
        userLogs.insert(
            // 1st argument of nano.insert()
            log,
            // callback to execute once the request to the DB is complete
            (error, success) => {
                if (success) {
                    resolve(200)
                } else {
                    reject(new Error(`In the creation of log. Reason: ${error.reason}.`))
                }
            }
        )
    })
}

function getUserLog(usrName, eventType, logLimit = 50) {
    // Get the user logs from the corresponding database
    // Default limit is 50

    return new Promise((resolve, reject) => {

        userLogs.view("queries", "user_" + eventType, { group: true, key: usrName }, (error, response) => {
            if (response) {

                output = {}

                console.log(`response.rows: ${JSON.stringify(response.rows)}`)

                // In case of user not found in the database
                if (response.rows.length === 0) {
                    resolve(output)
                    return
                }



                response.rows[0].value.forEach(function(doc) {
                    output[doc[0]] = doc[1]
                });

                resolve(output)
            } else {
                reject(new Error(`Cannot fetch global information for event (${eventType}). Reason: ${error.reason}.`))
            }
        })
    })
}

function getGlobalLog(eventType) {

    return new Promise((resolve, reject) => {

        userLogs.view("queries", "global_" + eventType, { group: true }, (error, response) => {
            if (response) {

                output = {}

                console.log(`response.rows: ${JSON.stringify(response.rows)}`)

                response.rows.forEach(function(doc) {
                    output[doc.key] = doc.value
                });
                resolve(output)
            } else {
                reject(new Error(`Cannot fetch global information for event (${eventType}). Reason: ${error.reason}.`))
            }
        })
    })
}







function createServiceLog(log) {
    //Insert the log into the corresponding database

    return new Promise((resolve, reject) => {
        servicesLogs.insert(
            // 1st argument of nano.insert()
            log,
            // callback to execute once the request to the DB is complete
            (error, success) => {
                if (success) {
                    resolve(200)
                } else {
                    reject(new Error(`In the creation of log. Reason: ${error.reason}.`))
                }
            }
        )
    })
}

function getServiceLog(serviceName, logLimit = 50) {
    // Get the user logs from the corresponding database
    // Default limit is 50

    return new Promise((resolve, reject) => {
        const q = {
            selector: {
                username: { "$eq": serviceName },
            },
            fields: ["_id", "eventType", "eventTime", "eventData"],

            limit: logLimit
        };


        servicesLogs.find(q, (error, response) => {
            if (response) {

                resolve(response.docs)
            } else {
                reject(new Error(`To fetch information for user (${serviceName}). Reason: ${error.reason}.`))
            }
        })
    })
}

module.exports = {
    createUserLog,
    getUserLog,
    createServiceLog,
    getServiceLog,
    getGlobalLog
}