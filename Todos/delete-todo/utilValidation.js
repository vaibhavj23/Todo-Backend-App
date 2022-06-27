const { MandatoryFieldMissingError } = require('./errorUtil');

/**
 * Checks whether particular field is valid
 * 
 * @param {Any} field field received
 * @returns {Boolean} returns true or false
 */
const isValidField = (field) => field !== undefined && field !== null && field !== '';

/**
 * Extracts required details from event object
 * 
 * @param {Object} event event received
 * @returns {Object} event request data
 */
const getRequestData = (event) => {
    const userId = event.pathParameters.userId;
    const todoId = event.pathParameters.todoId;
    let todoIds;

    // if todoIds are passed in querystringparam , perform batch delete
    if (isValidField(event.queryStringParameters)) {
        todoIds = isValidField(event.queryStringParameters.todoIds) ? event.queryStringParameters.todoIds : [];
        if (!Array.isArray(todoIds)) {
            todoIds = todoIds.split(',');
        }
    }

    if (isValidField(userId) && isValidField(todoIds)) {
        return { userId, todoIds };
    } else if (isValidField(userId) && isValidField(todoId)) {
        return { userId, todoId };
    } else {
        throw new MandatoryFieldMissingError('userId or todoId missing');
    }
}


module.exports = {
    getRequestData,
    isValidField
}