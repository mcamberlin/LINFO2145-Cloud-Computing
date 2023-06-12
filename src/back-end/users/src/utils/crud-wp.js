const bcrypt = require('bcryptjs')
const tku = require('./en-de-coders')

var users = require('nano')(process.env.DB_URL)

function equalPassws(usrPass, usrDbPass) {
    return bcrypt.compareSync(usrPass, usrDbPass)
}

function createUser(usrName, passw) {
    return new Promise((resolve, reject) => {
        var isAdmin = false;
        if (usrName == "admin") {
            isAdmin = true;
        }
        users.insert({ 'passw': bcrypt.hashSync(passw, bcrypt.genSaltSync()), "isAdmin": isAdmin },
            usrName,
            (error, success) => {
                if (success) {
                    resolve(tku.encodeToken(usrName))
                } else {
                    reject(new Error(`In the creation of user (${usrName}). Reason: ${error.reason}.`))
                }
            }
        )
    })
}

function getUser(usrName, passw) {
    return new Promise((resolve, reject) => {
        users.get(usrName, (error, success) => {
            if (success) {
                if (!equalPassws(passw, success.passw)) {
                    reject(new Error(`Passwords (for user: ${usrName}) do not match.`))
                }
                resolve(success)
            } else {
                reject(new Error(`To fetch information of user (${usrName}). Reason: ${error.reason}.`))
            }
        })
    })
}

module.exports = {
    createUser,
    getUser
}