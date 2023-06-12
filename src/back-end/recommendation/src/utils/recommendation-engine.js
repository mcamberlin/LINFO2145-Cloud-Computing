const { getGlobalLog, getUserLog } = require('./logging-connector')

const { getUserCart } = require('./purchase-connector')

const global_weight = {
    "CartCheckedOut": 0.01,
    "ItemViewed": 0.001,
}

const user_weight = {
    "CartCheckedOut": 5,
    "ItemViewed": 1,
    "ItemAddedToCart": 3,
}

// This allow to enable/disable global log and user log
const ENABLE_GLOBAL_LOG = process.env.BUILD_ENV === 'test' || true
const ENABLE_USER_LOG = process.env.BUILD_ENV === 'test' || true


function getRecommendation(username, limit = 3) {
    return new Promise((resolve, reject) => {
        let itemScore = {}
        let promiseList = []
        let userCart = [];

        if (ENABLE_GLOBAL_LOG) {
            for (const [logType, weight] of Object.entries(global_weight)) {
                promiseList.push(new Promise((resolve, reject) => {
                    getGlobalLog(logType).then((global_log) => {
                        for (const [productID, count] of Object.entries(global_log)) {
                            if (itemScore[productID] == undefined) {
                                itemScore[productID] = 0
                            }
                            itemScore[productID] += count * weight
                        }
                        resolve()
                    }).catch((err) => { return; })
                }))
            }
        }

        if (ENABLE_USER_LOG) {
            for (const [logType, weight] of Object.entries(user_weight)) {
                promiseList.push(new Promise((resolve, reject) => {
                    getUserLog(username, logType).then((user_log) => {
                        for (const [productID, count] of Object.entries(user_log)) {
                            if (itemScore[productID] == undefined) {
                                itemScore[productID] = 0
                            }
                            itemScore[productID] += count * weight
                        }
                    }).catch((err) => { return; })
                    resolve()
                }))
            }
        }
        promiseList.push(new Promise((resolve, reject) => {
            getUserCart(username).then((cart) => {
                userCart = cart
                resolve()
            }).catch((err) => {
                userCart = cart;
                resolve()
            })
        }))


        // Wait for all the promise to finish
        Promise.all(promiseList).then(() => {
            // In order to hide the score from the user, we need to sort the itemScore. We also need to remove the item that is already in the cart
            // and only return the top <limit> items
            let sortedItemScore = Object.keys(itemScore).sort(function(a, b) {
                return itemScore[b] - itemScore[a]
            }).filter((item) => {
                return !userCart.includes(item)
            }).slice(0, limit)

            resolve(sortedItemScore)
        })
    })
}





module.exports = {
    getRecommendation
}