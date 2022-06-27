const { deleteTodo, batchDeleteTodos } = require("./serviceDynamodb");
const { getRequestData } = require("./utilValidation");

/**
 * Start function of a service
 * 
 * @param {Object} event event received from request
 * @returns {Object} response object
 */
const process = async (event) => {
    const payload = getRequestData(event);
    let response;
    if (payload.todoIds) {
        response = await batchDeleteTodos(payload)
    } else {
        response = await deleteTodo(payload);
    }
    return response;
}

module.exports = {
    process
}