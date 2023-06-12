/* REST API File */
const express = require('express')
const log = require('debug')('users-d')

const app = express.Router()
const { getRecommendation } = require('./utils/recommendation-engine')

const { logPerformance } = require('./utils/logging')


// GET: get the purchase history for the specified user
app.get('/recommendation/:username', logPerformance("recommendation", (req, res) => {
    var usr = req.params.username

    log(`Getting history of user (${usr})`)
    return getRecommendation(usr)
        .then((products) => {
            res.status(200).json({ status: 'success', "products": products })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))







module.exports = app