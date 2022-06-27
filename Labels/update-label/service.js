const { requestMode, getRequestData } = require('./utilValidation');
const { createLabel } = require('./serviceDynamodb');
const uuid = require('uuid');
const {
    CREATE_MODE,
    UPDATE_MODE
} = require('./constants');

/**
 * Start function of a service
 * 
 * @param {Object} event event received from request
 * @returns {Object} response object
 */
const process = async (event) => {
    let payload;
    let response;
    const mode = requestMode(event);
    switch (mode) {
        case CREATE_MODE: {
            payload = getRequestData(event, mode);
            response = await handleCreateLabelRequest(payload);
            break;
        }
        case UPDATE_MODE: {
            payload = getRequestData(event);
            response = await handleUpdateLabelRequest(payload);
            break;
        }
    }
    return response;
}

/**
 * Creates a new label for a user
 * 
 * @param {Obejct} payload constructed request payload
 * @returns {Object} response of create operation
 */
const handleCreateLabelRequest = async (payload) => {
    const createObj = {
        userId: payload.userId,
        labelId: uuid.v4(),
        labelName: payload.labelName,
        description: payload.description || "",
        lastUpdated: Date.now()
    };
    const response = await createLabel(createObj);
    return response;
}

/**
 * Updates a existing label for a user
 * 
 * @param {Obejct} payload constructed request payload
 * @returns {Object} response of update operation
 */
const handleUpdateLabelRequest = async (payload) => {
    const updateObj = {
        ...payload,
        userId: payload.userId,
        labelId: payload.labelId,
        lastUpdated: Date.now()
    };
    const response = await createLabel(updateObj);
    return response;
}


module.exports = {
    process
}