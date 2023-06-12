const LOGURL = 'http://logs-daemon';
const axios = require('axios');

if (process.env.BUILD_ENV === 'test') {
    function getUserLog(username, logType) {

        let response = {
            "0": 10,
            "1": 30,
            "2": 0,
            "3": 0,
        }
        return new Promise((resolve, reject) => {
            resolve(response)
        });
    }

    function getGlobalLog(logType) {
        // To mock the response from the logging service
        let response = {
            "0": 100,
            "1": 200,
            "2": 300,
            "3": 4000,
        }

        return new Promise((resolve, reject) => {
            resolve(response)
        });
    }


} else {


    function getUserLog(username, logType) {
        return new Promise((resolve, reject) => {
            axios.get(LOGURL + "/userlog/" + username + "/" + logType)
                .then((response) => {
                    console.log("User log for user " + username + " and log type " + logType + " is " + JSON.stringify(response.data.aggregatedLogs))
                    resolve(response.data.aggregatedLogs);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getGlobalLog(logType) {
        return new Promise((resolve, reject) => {
            axios.get(LOGURL + "/globallog/" + logType)
                .then((response) => {
                    console.log("Global log for log type " + logType + " is " + JSON.stringify(response.data.aggregatedLogs))
                    resolve(response.data.aggregatedLogs);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }


}

module.exports = {
    getGlobalLog,
    getUserLog

};