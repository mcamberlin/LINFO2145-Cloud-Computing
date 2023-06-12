/* REST API File */
const express = require('express')
const log = require('debug')('users-d')

const app = express.Router()
const db = require('./utils/crud-wp')
const { getProductInfo, getCategoryInfo, propagateBuyOnStocks } = require('./utils/product-connector')

const { logPerformance } = require('./utils/logging')

const { isIdentityValid } = require('./utils/authentication_utils')



// GET: get ${username}'s cart
app.get('/cart/:username', logPerformance("purchase", (req, res) => {
    var usr = req.params.username

    log(`Getting cart of user (${usr})`)
    return db.getCart(usr)
        .then((cart) => {
            res.status(200).json({ status: 'success', "cart": cart })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

// POST: add the product into $username's cart. If there is no cart for user $username, a new one is created.
// ${req.body} is a JSON object with the fields category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
app.post('/cart/:username/', logPerformance("purchase", (req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }
    var product = req.body
    return db.addToCart(usr, product)
        .then(() => {
            res.status(200).json({ status: 'success' })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))



// PUT: remove a product from $username's cart
// ${req.body} is a JSON object with the fields category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
app.put('/cart/:username/', logPerformance("purchase", (req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }
    var product = req.body
    log(`Remove ${product.name} from ${usr}'s cart`)
    return db.rmFromCart(usr, product)
        .then((cart) => {
            res.status(200).json({ status: 'success' })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))

// DELETE: empty ${username}'s cart
app.delete('/cart/:username/', logPerformance("purchase", (req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }
    return db.delCart(usr)
        .then(() => {
            res.status(200).json({ status: 'success' })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))


// GET: get the purchase history for the specified user
app.get('/history/:username', logPerformance("purchase", (req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }
    log(`Getting history of user (${usr})`)
    return db.getHistory(usr)
        .then((history) => {
            res.status(200).json({ status: 'success', "history": history })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

// POST: add a purchase into $username's purchase history. If there is no purchase history for $username , a new one is created.
// ${req.body} is a JSON object with the fields id=[string], cart=['Products'].
app.post('/history/:username/', logPerformance("purchase", (req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }
    var purchase = req.body
    log(`Add ${purchase} into ${usr}'s history`)
    return db.addToHistory(usr, purchase)
        .then(() => {
            res.status(200).json({ status: 'success' })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))

// POST: add the product into $username's cart. If there is no cart for user $username, a new one is created.
// ${req.body} is a JSON object with the fields category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
app.post('/cart/:username/purchase', logPerformance("purchase", async(req, res) => {
    var usr = req.params.username
    if (!isIdentityValid(usr, req.headers.authorization)) {
        res.status(401).send("Invalid identity")
        return
    }

    return db.getCart(usr).then((cart) => {

            /** cart is supposed to have the following format:
             * [
             *  {
             *     id: "string",
             *     quantity: "int",
             *  },
             * ...
             * ]
             * 
             *  */

            // calculate the required information for the purchase
            var total = 0;
            var items = [];
            var date = Date.now();

            var promises = cart.map(async(item) => {
                const product = await getProductInfo(item.id)

                var fetchCategorySafe = async(prod) => {
                    try {
                        const category = await getCategoryInfo(prod.category)
                        return category;

                    } catch (err) {
                        return { name: "Unknown" };
                    }
                };

                console.log(`Product: ${product.name}, available: ${product.quantity}, requested: ${item.quantity}`)
                if (product.quantity >= item.quantity) {
                    var propagateBuy = async() => {
                        try {
                            await propagateBuyOnStocks(product._id, item.quantity)
                            var category = await fetchCategorySafe(product);
                            console.log(`Category: ${category}`)
                            items.push({
                                id: item.id,
                                name: product.name,
                                price: product.price,
                                quantity: item.quantity,
                                subtotal: product.price * item.quantity,
                                category: category.name,
                                image: product.image
                            })
                            total += product.price * item.quantity;
                            console.log(`Propagated buy on ${product._id} for ${item.quantity} items`)
                            return {
                                id: item.id,
                                name: product.name,
                                price: product.price,
                                quantity: item.quantity,
                                subtotal: product.price * item.quantity,
                                category: category.name,
                            };
                        } catch (err) {
                            console.log(`Failed to propagate buy on ${product._id} for ${item.quantity} items`)
                            return {};
                        };
                    }

                    await propagateBuy();

                }




            });


            Promise.all(promises).then(() => {

                // create the purchase object
                var purchase = {
                    date: date,
                    total: total,
                    items: items,
                }
                console.log(purchase);
                if (purchase.items.length == 0) {
                    res.status(200).json({ status: 'success', message: "No items were purchased" })
                    return;
                }
                // add the purchase to the history
                db.addToHistory(usr, purchase).then(() => {
                    // delete the cart
                    db.delCart(usr).then(() => {
                        res.status(200).json({ status: 'success' })
                    }).catch((err) => {
                        res.status(500).json({ status: 'error', message: String(err) })
                    })
                }).catch((err) => {
                    res.status(500).json({ status: 'error', message: String(err) })
                })
            })


        }

    ).catch((err) => {
        res.status(404).json({ status: 'error', message: String(err) })
    })
}))



module.exports = app