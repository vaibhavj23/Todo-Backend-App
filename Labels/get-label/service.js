const { getOneLabel, getAllLabels } = require("./serviceDynamodb");
const { getRequestData, requestMode } = require("./utilValidation");
const { GET_ALL_LABELS, GET_ONE_LABEL } = require('./constants');

/**
 * Start function of a service
 * 
 * @param {Object} event event received from request
 * @returns {Object} response object
 */
const process = async (event) => {
    const mode = requestMode(event);
    const payload = getRequestData(event, mode);
    let response;
    switch (mode) {
        case GET_ONE_LABEL: {
            response = await getOneLabel(payload);
            break;
        }
        case GET_ALL_LABELS: {
            response = await getAllLabels(payload);
            break;
        }
    }
    return response;
}

module.exports = {
    process
}