const { MandatoryFieldMissingError } = require('./errorUtil');
const { GET_ALL_LABELS, GET_ONE_LABEL } = require('./constants');

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
        return GET_ALL_LABELS;
    } else if (event.resource === '/v1/todoapp/user/{userId}/label/{labelId}') {
        return GET_ONE_LABEL;
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
    const userId = event.pathParameters.userId;
    const response = {
        userId
    };
    if (!isValidField(userId)) {
        throw new MandatoryFieldMissingError('userId missing');
    }
    if (mode === GET_ONE_LABEL) {
        response.labelId = event.pathParameters.labelId;
    }
    return response;
}


module.exports = {
    getRequestData,
    isValidField,
    requestMode
}