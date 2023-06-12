const LOGURL = 'http://purchase-daemon';
const axios = require('axios');

if (process.env.BUILD_ENV === 'test') {
    function getUserCart(username) {

        let response = []
        return new Promise((resolve, reject) => {
            resolve(response)
        });
    }

} else {

    function getUserCart(username) {
        return new Promise((resolve, reject) => {
            axios.get(LOGURL + "/cart/" + username)
                .then((response) => {
                    var cleanedCart = [];

                    for (let i = 0; i < response.data.cart.length; i++) {
                        cleanedCart.push(response.data.cart[i].id);
                    }

                    resolve(cleanedCart);
                })
                .catch((error) => {
                    resolve([]);
                });
        });
    }

}

module.exports = {
    getUserCart
};