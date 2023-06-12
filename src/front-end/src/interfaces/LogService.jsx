import axios from 'axios' // axios = library used for HTTP client
// you can overwrite the URI of the authentication microservice with this environment variable
const url = process.env.REACT_APP_LOG_SERVICE_URL || 'http://192.168.64.13:3005'  // if first part not defined, then do the second part 

class Log {
    // setters
    setHandlers(onSucc, setAuthStatus, changeRoute) {
        this.onSucc = onSucc
        this.setAuthStatus = setAuthStatus
        this.changeRoute = changeRoute
    }

    // POST /userlog
    /**
     * Use this function to log a user's activity. Data should contain the following fields:
     * - eventType: string
     * - details : object
     * 
     * Suggestions for eventType:
     * - "ItemViewed"
     * - "ItemAddedToCart"
     * - "ItemRemovedFromCart"
     * - "CartCheckedOut"
     * 
     * Suggestions for details:
     * - ItemViewed: { itemId: string }
     * - ItemAddedToCart: { itemId: string, quantity: number }
     * - ItemRemovedFromCart: { itemId: string, quantity: number }
     * - CartCheckedOut: { items: [ { itemId: string, quantity: number } ] }
     *   
     * @param {*} data 
     * @param {*} onErr 
     */
    logUserActivity(data, onErr) {
        const username = window.localStorage.getItem('username').replaceAll('"', '');
        const authToken = window.localStorage.getItem('authToken');

        let data_to_send = {
            username: username,
            userEvent: {
                eventType: data.eventType,
                eventTime: Date.now(),
                eventData: data.details
            }
        }


        axios.post(`${url}/userlog`, data_to_send, { headers: { Authorization: `Bearer ${authToken}` } })


    }
}

export default Log
