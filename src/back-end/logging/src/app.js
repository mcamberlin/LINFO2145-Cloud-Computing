/* REST API File */
const express = require('express')
const log = require('debug')('users-d')
const { verifyEvent } = require('./utils/general')



const app = express.Router()
const db = process.env.WITH_PERSISTENT_DATA ? require('./utils/crud-wp') : require('./utils/crud')

app.post('/userlog', (req, res) => {
    //Add user identication


    var usr = req.body.username
    var userEvent = req.body.userEvent

    if (usr === undefined || usr === null || usr === "") {
        res.status(400).send("Invalid username")
        return
    }
    if (userEvent === undefined || userEvent === null) {
        res.status(400).send("Invalid user event")
        return
    }

    const { valid, reason } = verifyEvent(userEvent)


    if (!valid) {
        res.status(400).send(`Invalid user event. Reason: ${reason}`)
        return
    }

    const logToSave = {...userEvent, username: usr }

    return db.createUserLog(logToSave)
        .then((response) => {
            res.status(200).json({ status: 'Success' })
        })
        .catch((err) => {
            res.status(500).json({ status: 'Error', message: String(err) })
        })
})

app.get('/userlog/:username/:eventType', (req, res) => {
    var usr = req.params.username
    var eventType = req.params.eventType


    return db.getUserLog(usr, eventType)
        .then((logs) => {
            res.status(200).json({ status: 'success', eventType, aggregatedLogs: logs })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
})

app.get('/globallog/:eventType', (req, res) => {
    var eventType = req.params.eventType


    return db.getGlobalLog(eventType)
        .then((logs) => {
            res.status(200).json({ status: 'success', eventType, aggregatedLogs: logs })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
})

app.post('/servicelog', (req, res) => {
    //Add user identication
    var service = req.body.serviceName
    var serviceEvent = req.body.serviceEvent
    var eventLevel = req.body.eventLevel

    if (service === undefined || service === null || service === "") {
        res.status(400).send("Invalid service name")
        return
    }
    if (serviceEvent === undefined || serviceEvent === null) {
        res.status(400).send("Invalid service event")
        return
    }

    const { valid, reason } = verifyEvent(serviceEvent)


    if (!valid) {
        res.status(400).send(`Invalid service event. Reason: ${reason}`)
        return
    }

    const logToSave = {...serviceEvent, serviceName: service, eventLevel: req.body.eventLevel }
    console.log(logToSave)

    return db.createServiceLog(logToSave)
        .then((response) => {
            res.status(200).json({ status: 'Success' })
        })
        .catch((err) => {
            res.status(500).json({ status: 'Error', message: String(err) })
        })
})

app.get('/serviceLog/:serviceName', (req, res) => {
    var serviceName = req.params.serviceName


    return db.getServiceLog(serviceName)
        .then((logs) => {
            if (logs.length === 0) {
                res.status(404).send({ status: 'error', message: `No logs found for service ${serviceName}.` })
                return
            }
            res.status(200).json({ status: 'success', logs })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
})






module.exports = app