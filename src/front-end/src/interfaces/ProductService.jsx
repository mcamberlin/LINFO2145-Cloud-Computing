import axios from 'axios' 
const url = process.env.REACT_APP_PRODUCTS_SERVICE_URL || 'http://192.168.56.102:3007' 

class ProductService {

    // setters
    setHandlers(setProducts, setCategories, setProductsMap) {
        this.setProducts = setProducts                  // setProducts
        this.setCategories = setCategories              // setCategories
        this.setProductsMap = setProductsMap            // setProductsMap
    }

    fetchProducts() {
        this.getProducts()
        .then((products) => {
            
            // It is necessary to sort the product to create an object like 
            // {
            //  category1: {product1, product2, ...},
            //  category2: {product3, product4, ...},
            //  ...
            // }
            let productsObjectTmp = {}
            let productsObject = {}
            let promiseList = []
            let productsMap = {}

            for (let i = 0; i < products.length; i++) {
                let product = products[i]
                productsMap[product['_id']] = product
                productsObjectTmp[product.category] = productsObjectTmp[product.category] || {}
                productsObjectTmp[product.category][product._id] = product
            }

            this.setProductsMap(productsMap);

            console.log(productsObjectTmp)
            for (let key in productsObjectTmp) {
                let prom = new Promise((resolve, reject) => {
                    this.getCategoryNameFromId(key).then((category) => {

                        productsObject[category] = productsObjectTmp[key]
                        let length = Object.keys(productsObjectTmp[key]).length;
                        console.log(`Category ${category} has ${length} product(s)`)

                        resolve(category)
                    }).catch((err) => {
                        productsObject["Miscellaneous"] = productsObjectTmp[key]
                        resolve("None")
                    })
                })
                promiseList.push(prom)
            }

            Promise.all(promiseList).then(() => {
                this.setProducts(productsObject)
            })

        }).catch((error) => {
            console.error(error.message);
        })


    }
    
    fetchCategories(onErr) {
        this.getCategories(onErr)
            .then((categories) => {
                let categoriesMap = {};                 // Mapping: key= categoryName, value= categoryId
                categories.forEach(category => {
                    let categoryId = category._id;
                    let categoryName = category.name;
                    categoriesMap[categoryId] = categoryName;
                });
                this.setCategories(categoriesMap);
            }).catch((error) => {
                console.error(error.message);
            })
    }

    /**
     * @async
     * Use this function to get the list of available products
     * Output a list of product.
     */
    getProducts() {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/products`)
                .then((response) => {
                    resolve(response.data.products)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

    /**
     * @async
     * Use this function to get the information about the specified productId
     * 
     */

    getProductFromId(productId, onErr) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/products/${productId}`).then((response) => {
                resolve(response.data.product)
            }).catch((error) => {
                const msg = `Fetching product ${productId} failed.`
                onErr(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })

    }

    /**
     * @async
     * Use this function to create a new product.
     * This function require productInfo with following attribute:
     * name: string
     * price: number
     * category: categoryId(String)
     * quantity: int
     * image: string
     * 
     * image has to follow this structure:
     * `data:image/<png/jpg>;base64,<base64 encoded image data>`
     * 
     * The function return the id of the new product. 
     */
    addProduct(productInfo, onErr) {
        return new Promise((resolve, reject) => {
            axios.post(`${url}/products`, productInfo).then((response) => {
                resolve(response.data.productId)
            }).catch((error) => {
                onErr(`Adding new product failed. Error: ${error.message}`)
                reject(error)
            })
        })
    }


    /**
     * @async
     * Use this function to modify a product.
     * This function accept productInfo with following attribute:
     * name: string
     * price: number
     * category: categoryId(string)
     * quantity: int
     * image: url (string)
     * 
     * The function return the id of the product. 
     */
    updateProduct(productId, productInfo, onErr) {
        return new Promise((resolve, reject) => {
            axios.put(`${url}/products/${productId}`, productInfo)
                .then((response) => {
                    resolve(response.data.productId)
                }).catch((error) => {
                    const msg = `Modifying product ${productInfo.name} failed.`
                    onErr(`${msg} Error: ${error}`)
                    reject(error)
                })
        })
    }

    /**
     * @async
     * Use this function to delete a product.
     * The function return the id of the deleted product. 
     */
    deleteProduct(productId, onErr) {
        return new Promise((resolve, reject) => {
            axios.delete(`${url}/products/${productId}`).then((response) => {
                resolve(response.data.productId)
            }).catch((error) => {
                const msg = `Deleting product ${productId} failed.`
                onErr(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })
    }

    /**
     * @async
     * Use this function to get the list of available categories
     * Output a list of category.
     */
    getCategories(onErr) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/categories`).then((response) => {
                resolve(response.data.categories)
            }).catch((error) => {
                const msg = "Fetching available categories failed."
                onErr(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })
    }

    /**
     * @async
     * Use this function to get the information about the specified categoryId
     * 
     */
    getCategoryNameFromId(categoryId) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/categories/${categoryId}`).then((response) => {
                resolve(response.data.category.name)
            }).catch((error) => {
                const msg = `Fetching category ${categoryId} failed.`
                console.log(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })
    }

    /**
     * @async
     * Use this function to delete a category.
     * The function return the id of the deleted category. 
     */
    deleteCategory(categoryId, onErr) {
        return new Promise((resolve, reject) => {
            axios.delete(`${url}/categories/${categoryId}`).then((response) => {
                resolve(response.data.categoryId)
            }).catch((error) => {
                const msg = `Deleting the category ${categoryId} failed.`
                onErr(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })
    }

    /**
     * @async
     * Use this function to create a new category.
     * This function require categoryInfo with following attribute:
     * name: string
     * 
     * The function return the id of the new category. 
     */
    addCategory(categoryInfo, onErr) {
        return new Promise((resolve, reject) => {
            axios.post(`${url}/categories`, categoryInfo).then((response) => {
                resolve(response.data.categoryId)
            }).catch((error) => {
                const msg = `Creating the category ${categoryInfo} failed.`
                onErr(`${msg} Error: ${error.msg}`)
                reject(error)
            })
        })
    }
}

export default ProductService