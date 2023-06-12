/* REST API File */
const express = require('express')
const log = require('debug')('users-d')
const tku = require('./utils/en-de-coders')

const app = express.Router()
const db = require('./utils/crud-wp')

const { logInfo, logError, logPerformance } = require('./utils/logging')

const { initDb } = require("./utils/init-db")
initDb()


app.post('/user', logPerformance("auth", (req, res) => {
    var usr = req.body.username
    var usrPassw = req.body.password
    log(`Creating a new user (${usr}) identified with "${usrPassw}"`)
    return db.createUser(usr, usrPassw)
        .then((token) => {
            var isAdmin = false;
            if (usr === "admin") {
                isAdmin = true;
            }
            res.status(200).json({ status: 'success', isAdmin, token })
        })
        .catch((err) => {
            res.status(409).json({ status: 'error', message: String(err) })
        })
}))

/**
 * Get the token for the user with the given username and password.
 */
app.get('/user/:username/:password', logPerformance("auth", (req, res) => {
    var usr = req.params.username
    var passw = req.params.password
    log(`Getting user (${usr})`)
    return db.getUser(usr, passw)
        .then((userInfo) => {
            var token = tku.encodeToken(usr);
            var isAdmin = userInfo["isAdmin"];
            res.status(200).json({ status: 'success', isAdmin, token })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

module.exports = app