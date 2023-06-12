var cart = require('nano')(process.env.DB_URL)

function getCart(usrName) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, success) => {
            if (success) {
                resolve(success.cart)
            } else {
                reject(new Error(`To fetch cart of user (${usrName}). Reason: ${error.reason}.`))
            }
        })
    })
}

// ${product} is a JSON object with the fields:
// category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
function addToCart(usrName, product) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, doc) => {

            if (doc) {
                let found = false;
                for (i = 0; i < doc.cart.length && !found; i++) {
                    if (doc.cart[i].id == product.id) {
                        doc.cart[i].quantity += Number(product.quantity)
                        found = true;
                    }
                }
                if (!found) {
                    doc.cart.push(product);
                }

                let new_doc = { _id: doc._id, _rev: doc._rev, cart: doc.cart, history: doc.history };
                cart.insert(new_doc, (error, success) => {
                    if (success) {
                        resolve();
                    } else {
                        reject(new Error(`Error: The product cannot be added into ${usrName}'s cart. Reason: ${error.reason}.`))
                    }
                })
            } else {
                let new_doc = { cart: new Array(product), history: new Array() };
                cart.insert(new_doc, usrName, (error, success) => {
                    if (success) {
                        resolve()
                    } else {
                        reject(new Error(`Error: The product cannot be added into ${usrName}'s cart. Reason: ${error.reason}.`))
                    }
                });
            }
        })
    })
}

function rmFromCart(usrName, product) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, doc) => {
            if (doc) {
                let index = -1;
                let found = false;
                for (let i = 0; !found && i < doc.cart.length; i++) {
                    if (doc.cart[i].id == product.id) {
                        index = i;
                        found = true;
                    }
                }
                if (index != -1) { // found in the cart
                    doc.cart.splice(index, 1)
                    let new_doc = { _id: doc._id, _rev: doc._rev, cart: doc.cart, history: doc.history };
                    cart.insert(new_doc, (err, success) => {
                        if (success) {
                            resolve(doc.cart);
                        } else {
                            reject(new Error(`Error: The product cannot be removed from ${usrName}'s cart. Reason: ${err.reason}.`))
                        }
                    })
                } else {
                    reject(new Error(`Error: The product was not found in ${usrName}'s cart.`))
                }
            } else {
                reject(new Error(`Error: The user was not found in the purchase database. Reason: ${error.reason}.`))
            }
        })
    })
}

function delCart(usrName) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, doc) => {
            let new_doc = { _id: doc._id, _rev: doc._rev, cart: new Array(), history: doc.history };
            if (doc) {
                cart.insert(new_doc, (error, success) => {
                    if (success) {
                        resolve();
                    } else {
                        reject(new Error(`Error: To empty cart of user ${usrName}. Reason: ${error.reason}.`)) // HERE
                    }
                })
            } else {
                reject(new Error(`Error: To empty cart of user ${usrName}. Reason: ${error.reason}.`))
            }
        })
    })
}


function getHistory(usrName) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, success) => {
            if (success) {
                resolve(success.history)
            } else {
                reject(new Error(`To fetch purchase history of user (${usrName}). Reason: ${error.reason}.`))
            }
        })
    })
}

function addToHistory(usrName, purchase) {
    return new Promise((resolve, reject) => {
        cart.get(usrName, (error, doc) => {

            if (doc) {
                doc.history.push(purchase);
                let new_doc = { _id: doc._id, _rev: doc._rev, cart: doc.cart, history: doc.history };
                cart.insert(new_doc, (error, success) => {
                    if (success) {
                        resolve();
                    } else {
                        reject(new Error(`Error: The purchase cannot be added into ${usrName}'s history. Doc ${JSON.stringify(new_doc)}.Reason: ${error.reason}.`))
                    }
                })
            } else {
                let new_doc = { cart: new Array(), history: new Array(purchase) };
                cart.insert(new_doc, usrName, (error, success) => {
                    if (success) {
                        resolve()
                    } else {
                        reject(new Error(`Error: The purchase cannot be added into ${usrName}'s history. Reason: ${error.reason}.`))
                    }
                });
            }
        })
    });
}

module.exports = {
    getCart,
    addToCart,
    rmFromCart,
    delCart,
    getHistory,
    addToHistory
}