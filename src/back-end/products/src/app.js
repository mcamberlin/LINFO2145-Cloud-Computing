/* REST API File */
const express = require('express')
const log = require('debug')('products-d')
const { verifyProduct, verify } = require('./utils/general')
const { v4 } = require('uuid')
const { uploadPicture } = require('./utils/az-utils')
const app = express.Router()
const db = require('./utils/crud-wp')

// Populate the DB with some products
const { initDb } = require("./utils/init-db")
initDb()

const { logPerformance } = require('./utils/logging')


const uuidv4 = v4;

app.post('/products/', logPerformance("products", (req, res) => {
    //Add product information
    var product = req.body
    const { valid, reason } = verifyProduct(product)

    if (!valid) {
        res.status(400).send(`Invalid product information. Reason: ${reason}`)
        return
    }

    const image_type = product.image.split(';')[0].split('/')[1]
    const image_base64 = product.image.split(',')[1]
    return uploadPicture(image_base64, image_type).then((url) => {
        product.image = url
        const productId = uuidv4();
        product._id = productId;

        log(`Add ${product.name} into catalog`)


        db.addProduct(product)
            .then(() => {
                res.status(200).json({ status: 'success', productId: productId })
            })
            .catch((err) => {
                res.status(500).json({ status: 'error', message: String(err) })
            })
    }).catch((error) => {
        res.status(500).send(`Failed to upload image to blob storage. Reason: ${error}`)
        return
    })


}))

app.put('/products/:productId/', logPerformance("products", (req, res) => {
    //Modify product information
    let productId = req.params.productId

    let infoToUpdate = req.body;

    let resultCheck;
    for (const [key, value] of Object.entries(infoToUpdate)) {
        resultCheck = verify(key, value)
        if (!resultCheck.valid) {
            res.status(400).send(`Invalid ${key}. Reason: ${resultCheck.reason}`)
            return
        }
    }

    if (infoToUpdate.image) {
        const image_type = infoToUpdate.image.split(';')[0].split('/')[1]
        const image_base64 = infoToUpdate.image.split(',')[1]
        return uploadPicture(image_base64, image_type).then((url) => {
            infoToUpdate.image = url
            db.updateProduct(productId, infoToUpdate)
                .then(() => {
                    res.status(200).json({ status: 'success', "productId": productId })
                })
                .catch((err) => {
                    res.status(404).json({ status: 'error', "message": String(err) })
                })
        }).catch((error) => {
            res.status(500).send(`Failed to upload image to blob storage. Reason: ${error}`)
            return
        })

    }

    return db.updateProduct(productId, infoToUpdate)
        .then(() => {
            res.status(200).json({ status: 'success', "productId": productId })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

app.get('/products/:productId', logPerformance("products", (req, res) => {
    var productId = String(req.params.productId)

    return db.getProductInfo(productId)
        .then((productInfo) => {
            res.status(200).json({ status: 'success', "product": productInfo })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

app.post('/products/:productId/reduceQuantity', logPerformance("products", (req, res) => {
    // Decrease the product quantity of productId
    let productId = req.params.productId;
    let quantity = req.body.quantity;

    const { valid, reason } = verify("quantity", quantity)
    if (!valid) {
        res.status(400).send(`Invalid product quantity decrease. Reason: ${reason}`)
        return
    }
    return db.getProductInfo(productId).then(
        (product) => {
            if (quantity > product.quantity) {
                res.status(409).send(`Failed to decrease product with id ${productId}. Error: There is no enough remaining products.`)
                return
            }
            db.decreaseQuantity(productId, quantity)
                .then(() => {
                    res.status(200).json({ status: 'success', "productId": productId })
                })
                .catch((err) => {
                    res.status(404).json({ status: 'error', message: String(err) })
                })

        }
    ).catch((err) => {
        res.status(404).json({ status: 'error', message: String(err) })
    })
}))

app.get('/products/', logPerformance("products", (req, res) => {

    return db.getProducts()
        .then((products) => {
            res.status(200).json({ status: 'success', "products": products })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))

app.delete('/products/:productId/', logPerformance("products", (req, res) => {
    var productId = req.params.productId
    return db.getProductInfo(productId).then(
        (product) => {
            db.deleteProduct(product["_id"], product["_rev"])
                .then(() => {
                    res.status(200).json({ status: 'success', "productId": productId })
                })
                .catch((err) => {
                    res.status(500).json({ status: 'error', message: String(err) })
                })
        }
    ).catch((err) => {
        res.status(404).json({ status: 'error', message: String(err) })
    })
}))

app.post('/categories/', logPerformance("products", (req, res) => {
    //Add category information
    let category = req.body;

    const { valid, reason } = verify("name", category["name"])
    if (!valid) {
        res.status(400).send(`Invalid category name information. Reason: ${reason}`)
        return
    }

    const categoryId = uuidv4();
    category._id = categoryId;

    return db.addCategory(category)
        .then(() => {
            res.status(200).json({ status: 'success', "categoryId": categoryId })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))

app.put('/categories/:categoryId/', logPerformance("products", (req, res) => {
    //Modify product information
    let categoryId = req.params.categoryId

    let infoToUpdate = req.body;

    let resultCheck;
    for (const [key, value] of Object.entries(infoToUpdate)) {
        resultCheck = verify(key, value)
        if (!resultCheck.valid) {
            res.status(400).send(`Invalid ${key}. Reason: ${resultCheck.reason}`)
            return
        }
    }

    return db.getCategoryInfo(categoryId).then(
            (category) => {
                db.updateCategory(category, infoToUpdate)
                    .then(() => {
                        res.status(200).json({ status: 'success', "categoryId": categoryId })
                    })
                    .catch((err) => {
                        res.status(500).json({ status: 'error', "message": String(err) })
                    })
            })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })


}))

app.get('/categories/:categoryId/', logPerformance("products", (req, res) => {
    var categoryId = String(req.params.categoryId)

    return db.getCategoryInfo(categoryId)
        .then((categoryInfo) => {
            res.status(200).json({ status: 'success', "category": categoryInfo })
        })
        .catch((err) => {
            res.status(404).json({ status: 'error', message: String(err) })
        })
}))

app.get('/categories/', logPerformance("products", (req, res) => {

    return db.getCategories()
        .then((categories) => {
            res.status(200).json({ status: 'success', "categories": categories })
        })
        .catch((err) => {
            res.status(500).json({ status: 'error', message: String(err) })
        })
}))

app.delete('/categories/:categoryId/', logPerformance("products", (req, res) => {
    var categoryId = req.params.categoryId

    return db.getCategoryInfo(categoryId).then(
        (category) => {
            db.deleteCategory(category["_id"], category["_rev"])
                .then(() => {
                    res.status(200).json({ status: 'success', "categoryId": categoryId })
                })
                .catch((err) => {
                    res.status(500).json({ status: 'error', message: String(err) })
                })
        }
    ).catch((err) => {
        res.status(404).json({ status: 'error', message: String(err) })
    })
}))
module.exports = app