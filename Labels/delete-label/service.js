const { deleteLabel } = require("./serviceDynamodb");
const { getRequestData } = require("./utilValidation");

/**
 * Start function of a service
 * 
 * @param {Object} event event received from request
 * @returns {Object} response object
 */
const process = async (event) => {
    const payload = getRequestData(event);
    const response = await deleteLabel(payload);
    return response;
}

module.exports = {
    process
}