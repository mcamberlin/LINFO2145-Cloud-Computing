const axios = require('axios');

const LOG_URL = 'http://logs-daemon/servicelog';

function logInfo(serviceName, eventType, eventData) {
    const logData = {
        serviceName: serviceName,
        eventLevel: 'INFO',
        serviceEvent: {
            eventType: eventType,
            eventTime: Date.now(),
            eventData: eventData
        }
    };
    axios.post(LOG_URL, logData).catch((err) => { console.log(err) });
}

function logError(serviceName, eventType, eventData) {
    const logData = {
        serviceName: serviceName,
        eventLevel: 'ERROR',
        serviceEvent: {
            eventType: eventType,
            eventTime: Date.now(),
            eventData: eventData
        }
    };
    axios.post(LOG_URL, logData).catch((err) => { console.log(err) });
}

function logDebug(serviceName, eventType, eventData) {
    const logData = {
        serviceName: serviceName,
        eventLevel: 'DEBUG',
        serviceEvent: {
            eventType: eventType,
            eventTime: Date.now(),
            eventData: eventData
        }
    };
    axios.post(LOG_URL, logData).catch((err) => { console.log(err) });
}

function logWarn(serviceName, eventType, eventData) {
    const logData = {
        serviceName: serviceName,
        eventLevel: 'WARN',
        serviceEvent: {
            eventType: eventType,
            eventTime: Date.now(),
            eventData: eventData
        }
    };
    axios.post(LOG_URL, logData);
}

function logPerformance(serviceName, funct) {
    function wrapped(req, res, next) {
        const start = Date.now();

        try {
            funct(req, res, next);
        } catch (err) {
            logError(serviceName, "FATAL_ERROR", { "message": err.message }).catch((err) => { console.log(err) });
        } finally {

            const end = Date.now();
            const logData = {
                serviceName: serviceName,
                eventLevel: 'INFO',
                serviceEvent: {
                    eventType: 'PERFORMANCE',
                    eventTime: Date.now(),
                    eventData: {
                        duration: end - start
                    }
                }
            };
            if (process.env.BUILD_ENV === 'test') {
                return
            }
            try {
                axios.post(LOG_URL, logData).catch((err) => { console.log(err) });
            } catch {
                console.log("impossible to log")
            }
        }
    }
    return wrapped;
}
module.exports = {
    logInfo: logInfo,
    logError: logError,
    logDebug: logDebug,
    logWarn: logWarn,
    logPerformance: logPerformance
};