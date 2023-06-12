const axios = require("axios");
const url = process.env.REACT_APP_PURCHASE_SERVICE_URL || 'http://192.168.64.13:3003'
const ProductService = require('./ProductService')
class PurchaseService {
    constructor() {
        window.localStorage.setItem('purchases', JSON.stringify([]))
        this.productInterface = new ProductService.default();
    }

    setHandlers(setPurHistory, setCart) {
        this.setPurHistory = setPurHistory
        this.setCart = setCart
    }
    
    // GET /cart/${username}
    async getCart() {

        let username = JSON.parse(window.localStorage.getItem('username'))
        if (username == null) {
            return;
        }
        console.log(`Get ${username}'s cart`)
        const res = await axios.get(`${url}/cart/${username}`, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } });
        if (res.status === 200) {
            let myCart = res.data.cart
            /**
             * The cart is supposed to have this following structure:
             * [
             *  {
             *    id: string,
             *    quantity: int
             *  }
             *  ...
             * ]
             * 
             * It is necessary to fetch detailed information about each item in the cart.
             */
            let cartToShow = []
            let promisesListOfItem = myCart.map(async(item) => {
                const productInfo = await this.productInterface.getProductFromId(item.id)

                const safeCategoryFetching = async(prod) => {
                    try {
                        const category = await this.productInterface.getCategoryNameFromId(prod.category)
                        return category
                    } catch (error) {
                        return "None"
                    }
                }


                let category = await safeCategoryFetching(productInfo)

                return {
                    id: item.id,
                    name: productInfo.name,
                    price: productInfo.price,
                    quantity: item.quantity,
                    subtotal: item.quantity * productInfo.price,
                    category: category,
                    image: productInfo.image
                }

            })
            cartToShow = await Promise.all(promisesListOfItem)

            this.setCart(cartToShow)
            console.log("Cart fetched")
            console.log("Cart to show:")
            console.log(cartToShow)
            return cartToShow
        } else {
            throw new Error(`Error: ${res.status}`);
        }
    }
    
    // POST /cart/${username}
    // ${product} is a JSON object with the fields 
    // category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
    // These fields matches the specification of the POST call
    postProduct(product) {
            let username = JSON.parse(window.localStorage.getItem('username'))
            axios.post(`${url}/cart/${username}`, product, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } })
                .then(() => {
                    console.log(`Add ${product['quantity']} ${product['name']}(s) into ${username}'s cart.`)
                })
                .catch((error) => {
                    console.error(error.message)
                })
        }
        // PUT /cart/${username}
        // ${product} is a JSON object with the fields 
        // category=[string], id=[string], image=[string], name=[string], price=[int] and quantity=[int].
    rmProduct(product) {
            let username = JSON.parse(window.localStorage.getItem('username'))
            axios.put(`${url}/cart/${username}`, product, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } })
                .then((res) => {
                    console.log(`Remove ${product['name']} from ${username}'s cart.`)
                })
                .catch((error) => {
                    console.error(error.message)
                })
        }
        // DELETE /cart/${username}
    async delCart() {
            try {
                let username = JSON.parse(window.localStorage.getItem('username'))
                console.log(`Delete ${username}'s cart`)
                const res = await axios.delete(`${url}/cart/${username}`, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } });
                if (res.status === 200) {
                    this.setCart([])
                } else {
                    throw new Error(`Error: ${res.status}`);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        // GET /history/${username}
    fetchHistory() {
            let username = JSON.parse(window.localStorage.getItem('username'))
            if (username == null) {
                return
            }
            axios.get(`${url}/history/${username}`, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } })
                .then((res) => {
                    let myHistory = res.data.history
                    this.setPurHistory(myHistory)
                    console.log(`Get ${username}'s history:`)
                    console.log(myHistory)
                })
                .catch((error) => {
                    console.error(error.message)
                })
        }
        // POST /history/${username}
        // ${purchase} is a JSON object with the fields:
        // date=[string], items=[Product], total=[int]
        // ${items} is a JSON object with the fields:
        // id=[string], price=[int], quantity=[int], subtotal=[int], category=[string]
    postPurchase(purchase, items) {
        return new Promise((resolve, reject) => {
            purchase["items"] = items
            let username = JSON.parse(window.localStorage.getItem('username'))
            axios.post(`${url}/cart/${username}/purchase`, {}, { "headers": { "Authorization": `Bearer ${JSON.parse(window.localStorage.getItem('authToken'))}` } })
                .then(() => {
                    console.log(`Your cart was successfully purchased!`)
                    resolve()
                })
                .catch((error) => {
                    console.error(error.message)
                    reject()
                })
        })
    }
}
export default PurchaseService