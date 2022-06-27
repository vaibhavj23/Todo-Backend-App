const { getOneTodo, getAllTodos } = require("./serviceDynamodb");
const { getRequestData, requestMode } = require("./utilValidation");
const { GET_ALL_TODOS, GET_ONE_TODO } = require('./constants');

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
        case GET_ONE_TODO: {
            response = await getOneTodo(payload);
            break;
        }
        case GET_ALL_TODOS: {
            response = await getAllTodos(payload);
            break;
        }
    }
    return response;
}

module.exports = {
    process
}