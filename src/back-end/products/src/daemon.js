/* Launch the HTTP Server */
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const log = require('debug')('users-d')

const app = require('./app')
const server = express()

server.use(logger('dev'))
server.use(bodyParser.json({ limit: '50mb' }))
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    next()
})

server.use('/', app)

// launch an exception when a request is not part of the REST API
server.use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    // OR we respond with the status code 500 if an error occurs
server.use((err, req, res, next) => {
    const message = req.app.get('env') === 'development' ? err : {}
    log(`${message}`)
    log(err)
    res.status(err.status || 500)
    res.json({
        status: 'error'
    })
})

// daemon is now listening on port 80
const port = process.env.USERS_D_PORT || 80
server.listen(port, function() {
    log(`Listening at port ${port}`)
})