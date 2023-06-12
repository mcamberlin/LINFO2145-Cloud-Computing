const jwt = require('jwt-simple')
const moment = require('moment')

function decodeToken(token) {
    const playload = jwt.decode(token, process.env.TOKEN_SECRET)
    const now = moment().unix()

    if (now > playload.exp) {
        return false
    }
    return playload.sub
}

function usernameFromToken(token) {
    const decoded = decodeToken(token)
    if (decoded) {
        return decoded.username
    }
    return null
}

function removeBearerFromToken(token) {
    return token.replace('Bearer ', '')

}

function isIdentityValid(username, token) {
    if (process.env.BUILD_ENV === 'test') {
        return true
    }



    try {
        const decoded = decodeToken(removeBearerFromToken(token))
        console.log(`decoded: ${JSON.stringify(decoded)}, username: ${username}`)
        return decoded && decoded === username
    } catch (e) {
        console.log(e)
        return false
    }
}
module.exports = {
    isIdentityValid
}