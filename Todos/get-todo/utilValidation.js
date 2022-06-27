const { MandatoryFieldMissingError } = require('./errorUtil');
const { GET_ALL_TODOS, GET_ONE_TODO } = require('./constants');

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
    if (event.resource === '/v1/todoapp/user/{userId}/todo') {
        return GET_ALL_TODOS;
    } else if (event.resource === '/v1/todoapp/user/{userId}/todo/{todoId}') {
        return GET_ONE_TODO;
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
    if (mode === GET_ONE_TODO) {
        response.todoId = event.pathParameters.todoId;
    }
    return response;
}


module.exports = {
    getRequestData,
    isValidField,
    requestMode
}