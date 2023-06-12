const db = require('./crud-wp')


const categories = [
    { _id: '0', name: 'Fruits' },
    { _id: '1', name: 'Vegetables' },
    {_id: '-1', name: 'Miscellaneous'}
]

const products = [
    { _id: '1', name: 'Brocolli', price: 2.73, quantity: 3, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/broccoli.jpg', category: 1 },
    { _id: '2', name: 'Cauliflower', price: 6.30, quantity: 5, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg', category: 1 },
    { _id: '3', name: 'Cucumber', price: 5.60, quantity: 10, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg', category: 1 },
    { _id: '4', name: 'Beetroot', price: 8.70, quantity: 15, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/beetroot.jpg', category: 1 },
    { _id: '6', name: 'Apple', price: 2.34, quantity: 7, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/apple.jpg', category: 0 },
    { _id: '7', name: 'Banana', price: 1.69, quantity: 14, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/banana.jpg', category: 0 },
    { _id: '8', name: 'Grapes', price: 5.98, quantity: 79, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/grapes.jpg', category: 0 },
    { _id: '9', name: 'Mango', price: 6.80, quantity: 50, image: 'https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/mango.jpg', category: 0 },
]


const initDb = async() => {
    try {
        for (const category of categories) {
            db.addCategory(category)
        }
        for (const product of products) {
            db.addProduct(product)
        }
    } catch (err) {
        console.error('Error while initializing DB', err)
    }
}


module.exports = { initDb }