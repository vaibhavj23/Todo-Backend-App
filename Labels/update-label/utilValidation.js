const { MandatoryFieldMissingError, InvaildRequestError } = require('./errorUtil');
const {
    CREATE_MODE,
    UPDATE_MODE
} = require('./constants');

/**
 * Checks whether particular field is valid
 * 
 * @param {Any} field field received
 * @returns {Boolean} returns true or false
 */
const isValidField = (field) => field !== undefined && field !== null && field !== '';

/**
 * Determines mode of request based on url
 * 
 * @param {Object} event event received 
 * @returns {String} requested mode
 */
const requestMode = (event) => {
    if (event.resource === '/v1/todoapp/user/{userId}/label') {
        return CREATE_MODE;
    } else if (event.resource === '/v1/todoapp/user/{userId}/label/{labelId}') {
        return UPDATE_MODE;
    } else {
        throw new MandatoryFieldMissingError("Invalid mode");
    }
};

/**
 * Extracts required details from event object
 * 
 * @param {Object} event event received
 * @param {String} mode request mode
 * @returns {Object} event data
 */
const getRequestData = (event, mode) => {
    const body = parseEventBody(event);
    if (mode === CREATE_MODE && !isValidField(body.labelName)) {
        throw new MandatoryFieldMissingError('labelName missing in Request Body');
    }
    const userId = event.pathParameters.userId;
    const labelId = event.pathParameters.labelId;
    return Object.assign({},
        body,
        { userId, labelId }
    );
}

/**
 * parse json body in event
 *
 * @param {object} event the event
 * @returns {object} body event body
 */
const parseEventBody = (event) => {
    if (!isValidField(event.body)) {
        throw new MandatoryFieldMissingError('Body Missing in Request');
    } else {
        try {
            return JSON.parse(event.body);
        } catch (error) {
            throw new InvaildRequestError('Invalid Request Body');
        }
    }
};

module.exports = {
    requestMode,
    getRequestData,
    isValidField
}