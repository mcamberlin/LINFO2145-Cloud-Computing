var products = require('nano')(process.env.DB_URL_PRODUCTS)
var categories = require('nano')(process.env.DB_URL_CATEGORIES)

function addProduct(product) {
    //Insert the product into the corresponding database
    return new Promise((resolve, reject) => {
        products.insert(
            product,
            (error, success) => {
                if (success) {
                    resolve(200)
                } else {
                    reject(new Error(`In the creation of product. Reason: ${error.reason}.`))
                }
            }
        )
    })
}

function updateProduct(productId, infoToUpdate) {
    //Update the product
    return new Promise((resolve, reject) => {
        products.get(productId, (error, product) => {
            if (error) {
                reject(new Error(`In the update of ${productId}. Reason: ${error.reason}.`));
            }
            let newProduct = product;
            for (const [key, value] of Object.entries(infoToUpdate)) {
                newProduct[key] = value;
            }
            products.insert(newProduct, (error, response) => {
                if (!error) {
                    resolve(200);
                } else {
                    reject(new Error(`In the update of ${productId}. Reason: ${error.reason}.`));
                }
            });
        });
    })
}

function getProductInfo(productId) {
    return new Promise((resolve, reject) => {
        products.get(productId, (error, success) => {
            if (success) {
                resolve(success)
            } else {
                reject(new Error(`To fetch information of product (${productId}). Reason: ${error.reason}.`))
            }
        })
    })
}

function decreaseQuantity(productId, quantity) {
    return new Promise((resolve, reject) => {
        products.get(productId, (error, product) => {
            if (product) {
                products.insert({...product, "quantity": product.quantity - quantity },
                    (error, success) => {
                        if (success) {
                            resolve(200);
                        } else {
                            reject(new Error(`In the update of product with id ${productId} quantity. Reason: ${error.reason}.`));
                        }
                    });
            } else {
                reject(new Error(`Unable to fetch information of product (${productId}). Reason: ${error.reason}.`))
            }
        })
    })
}

function getProducts() {
    return new Promise((resolve, reject) => {
        const q = {
            selector: {}
        };

        products.find(q, (error, response) => {
            if (response) {
                resolve(response.docs)
            } else {
                reject(new Error(`To fetch information for products. Reason: ${error.reason}.`))
            }
        })
    })
}

function deleteProduct(productId, productRev) {
    return new Promise((resolve, reject) => {
        products.destroy(productId, productRev, (error, success) => {
            if (success) {
                resolve(productId)
            } else {
                reject(new Error(`Failed to delete product with id ${productId}. Error: ${error.reason}.`))
            }
        })
    })
}

// ===========================================================================

function addCategory(category) {
    //Insert the product into the corresponding database
    return new Promise((resolve, reject) => {
        categories.insert(
            category,
            (error, success) => {
                if (success) {
                    resolve(200)
                } else {
                    reject(new Error(`In the creation of category ${category.name}. Reason: ${error.reason}.`))
                }
            }
        )
    })
}

function updateCategory(category, infoToUpdate) {
    //Update the category
    return new Promise((resolve, reject) => {
        let newCategory = category;
        for (const [key, value] of Object.entries(infoToUpdate)) {
            newCategory[key] = value;
        }
        categories.insert(newCategory, (error, success) => {
            if (success) {
                resolve(200);
            } else {
                reject(new Error(`In the update of ${category.name}. Reason: ${error.reason}.`));
            }
        });
    })
}

function getCategoryInfo(categoryId) {
    return new Promise((resolve, reject) => {
        categories.get(categoryId, (error, success) => {
            if (success) {
                resolve(success)
            } else {
                reject(new Error(`To fetch information of category (${categoryId}). Reason: ${error.reason}.`))
            }
        })
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        const q = {
            selector: {}
        };

        categories.find(q, (error, response) => {
            if (response) {
                resolve(response.docs)
            } else {
                reject(new Error(`To fetch information for categories. Reason: ${error.reason}.`))
            }
        })
    })
}

function deleteCategory(categoryId, categoryRev) {
    return new Promise((resolve, reject) => {
        categories.destroy(categoryId, categoryRev, (error, success) => {
            if (success) {
                resolve(categoryId)
            } else {
                reject(new Error(`Failed to delete category with id ${categoryId}. Error: ${error.reason}.`))
            }
        })
    })
}

module.exports = {
    addProduct,
    updateProduct,
    getProductInfo,
    decreaseQuantity,
    getProducts,
    deleteProduct,
    addCategory,
    updateCategory,
    getCategoryInfo,
    getCategories,
    deleteCategory
}