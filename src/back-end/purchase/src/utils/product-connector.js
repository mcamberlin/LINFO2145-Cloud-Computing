const PRODUCTURL = 'http://products-daemon';
const axios = require('axios');

if (process.env.BUILD_ENV === 'test') {
    function getProductInfo(productId) {
        return new Promise((resolve, reject) => {
            if (productId === '1') {
                resolve({
                    id: '1',
                    name: 'Product 1',
                    price: 10,
                    image: 'http://image1.png',
                    category: '1',
                    quantity: 10000,
                });
            } else if (productId === '2') {
                resolve({
                    id: '2',
                    name: 'Product 2',
                    price: 20,
                    image: 'http://image2.png',
                    category: '1',
                    quantity: 10000,

                });
            } else if (productId === '3') {
                resolve({
                    id: '3',
                    name: 'Product 3',
                    price: 30,
                    image: 'http://image3.png',
                    category: '2',
                    quantity: 10000,

                });
            } else if (productId === '4') {
                resolve({
                    id: '4',
                    name: 'Product 4',
                    price: 40,
                    image: 'http://image4.png',
                    category: '2',
                    quantity: 10000,

                });
            } else {
                reject(new Error('Product not found'));
            }
        });
    }

    function getCategoryInfo(categoryId) {
        return new Promise((resolve, reject) => {
            if (categoryId === '1') {
                resolve({
                    id: '1',
                    name: 'Category 1',
                });
            } else if (categoryId === '2') {
                resolve({
                    id: '2',
                    name: 'Category 2',
                });
            } else {
                reject(new Error('Category not found'));
            }
        });
    }

    function propagateBuyOnStocks(productId, quantity) {
        return new Promise((resolve, reject) => {
            resolve(productId);
        });
    }
} else {


    function getProductInfo(productId) {
        return new Promise((resolve, reject) => {
            axios.get(PRODUCTURL + "/products/" + productId)
                .then((response) => {
                    resolve(response.data.product);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getCategoryInfo(categoryId) {
        return new Promise((resolve, reject) => {
            axios.get(PRODUCTURL + "/categories/" + categoryId)
                .then((response) => {
                    resolve(response.data.category);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function propagateBuyOnStocks(productId, quantity) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCTURL + "/products/" + productId + "/reduceQuantity/", { quantity })
                .then((response) => {
                    resolve(productId);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = {
    getProductInfo,
    getCategoryInfo,
    propagateBuyOnStocks
};