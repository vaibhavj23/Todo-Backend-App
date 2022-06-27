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
    const labelId = event.pathParameters.labelId;

    //request should contain both userId and labelId
    if (isValidField(userId) && isValidField(labelId)) {
        return { userId, labelId }
    } else {
        throw new MandatoryFieldMissingError('userId or labelId missing');
    }
}


module.exports = {
    getRequestData,
    isValidField
}