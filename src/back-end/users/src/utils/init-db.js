const db = require('./crud-wp')


const initDb = async() => {
    try {
        db.createUser("admin", "admin")
    } catch (err) {
        console.error('Error while initializing DB', err)
    }
}


module.exports = { initDb }