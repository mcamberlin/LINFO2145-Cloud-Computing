function verifyEvent(event, verifyEventTime = false) {
    // This function is used to verify the validity of the event
    // parameter. It returns the error code 400 if the event is
    // invalid.

    // Check if the event.eventType is a valid string



    if (event.eventType === undefined || event.eventType === null) {
        return { valid: false, reason: "eventType is undefined or null" };
    }
    if (event.eventType === "" || typeof event.eventType !== "string") {
        return { valid: false, reason: "eventType is not a valid string" };
    }

    // Check if the event.eventTime is a valid timestamp in milliseconds

    const acceptableEventIntervalDays = 7;
    const acceptableEventIntervalMin = Date.now() - acceptableEventIntervalDays * 24 * 60 * 60 * 1000;
    const acceptableEventIntervalMax = Date.now() + acceptableEventIntervalDays * 24 * 60 * 60 * 1000;


    if (event.eventTime === undefined || event.eventTime === null) {
        return { valid: false, reason: "eventTime is undefined or null" };
    }
    if (typeof event.eventTime !== "number") {
        return { valid: false, reason: `eventTime is not an number, type: ${typeof event.eventTime}` };
    }
    if (verifyEventTime) {
        if (event.eventTime < acceptableEventIntervalMin || event.eventTime > acceptableEventIntervalMax) {
            return { valid: false, reason: `eventTime is not in the good range, received date: ${new Date(event.eventTime)} (Verify that eventTime is in ms)` };
        }
    }


    // Check if the event.eventData is a valid string
    if (event.eventData === undefined || event.eventData === null) {
        return { valid: false, reason: `eventData is undefined or null or not an object` };
    }


    return { valid: true };
}

module.exports = {
    verifyEvent
}