const axios = require("axios");
const url = process.env.REACT_APP_RECOMMENDATIONS_SERVICE_URL

class RecommendationsService {

    setHandlers(setRecommendedProducts) {
        this.setRecommendedProducts= setRecommendedProducts
    }

    /**
     * @async
     * Use this function to get the list of recommended products
     * Output a list of product.
     */
    fetchRecommendations() {
        const username = window.localStorage.getItem('username').replaceAll('"', '');

        return new Promise((resolve, reject) => {
            axios.get(`${url}/recommendation/${username}`)
                .then((response) => {
                    const productIds = response.data.products;
                    this.setRecommendedProducts(productIds)
                    resolve(productIds)
                }).catch((error) => {
                    reject(error)
                })
        })
    }

}

export default RecommendationsService