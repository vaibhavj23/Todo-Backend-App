const { requestMode, getRequestData, isValidField } = require('./utilValidation');
const { createTodo, getTodo } = require('./serviceDynamodb');
const { sendEmail } = require('./serviceSes');
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
    let isReminderModified;
    let reminderMessage;
    const mode = requestMode(event);
    switch (mode) {
        case CREATE_MODE: {
            payload = getRequestData(event, mode);
            isReminderModified = payload.isReminderModified;
            delete payload.isReminderModified;
            // set reminder created message if reminder is not deleted
            if (isReminderModified && !payload.reminderMessage) reminderMessage = 'Reminder Created';
            delete payload.reminderMessage;
            response = await handleCreateTodoRequest(payload);
            break;
        }
        case UPDATE_MODE: {
            payload = getRequestData(event, mode);
            isReminderModified = payload.isReminderModified;
            delete payload.isReminderModified;
            // set reminder updated message if reminder is not deleted
            if (isReminderModified && !payload.reminderMessage) reminderMessage = 'Reminder Updated';
            delete payload.reminderMessage;
            response = await handleUpdateTodoRequest(payload);
            break;
        }
    }

    if (isReminderModified) {
        if (reminderMessage === undefined) reminderMessage = 'Reminder Deleted';
        sendEmail(response, reminderMessage);
    }
    return response;
}

/**
 * Creates a new todo for a user
 * 
 * @param {Obejct} payload constructed request payload
 * @returns {Object} response of create operation
 */
const handleCreateTodoRequest = async (payload) => {
    const createObj = {
        userId: payload.userId,
        todoId: uuid.v4(),
        todoName: payload.todoName,
        description: payload.description || "",
        lastUpdated: Date.now(),
        isArchived: false,
        reminder: payload.reminder
    };
    createObj.labels = isValidField(payload.labels) && Array.isArray(payload.labels) ? payload.labels : [];
    const response = await createTodo(createObj);
    return response;
}

/**
 * Updates a existing todo for a user
 * 
 * @param {Obejct} payload constructed request payload
 * @returns {Object} response of update operation
 */
const handleUpdateTodoRequest = async (payload) => {
    let labels;
    if (payload.addLabels.length > 0 || payload.removeLabels.length > 0) {
        let addLabels = isValidField(payload.addLabels) ? payload.addLabels : [];
        let removeLabels = isValidField(payload.removeLabels) ? payload.removeLabels : [];
        const getObj = {
            userId: payload.userId,
            todoId: payload.todoId,
        }
        const currentTodoDetails = await getTodo(getObj);
        if (Object.keys(currentTodoDetails).length === 0) {
            return {
                message: 'No todo found',
                todoId: payload.todoId
            }
        }
        labels = getUpdatedLabels(currentTodoDetails.labels, addLabels, removeLabels);
    }
    delete payload.addLabels;
    delete payload.removeLabels;
    delete payload.labels;

    const updateObj = {
        ...payload,
        userId: payload.userId,
        todoId: payload.todoId,
        lastUpdated: Date.now(),
        ...(labels ? { labels } : {}),

    };
    const response = await createTodo(updateObj);
    return response;
}

/**
 * Creates a new label array based on existing, new and removed labels
 * 
 * @param {Array} currentLabels labels present in database
 * @param {Array} addLabels labels to be added
 * @param {Array} removeLabels labels to be removed
 * @returns {Array} array of labels
 */
const getUpdatedLabels = (currentLabels, addLabels, removeLabels) => {
    currentLabels = currentLabels.filter((label) => {
        if (removeLabels.indexOf(label) !== -1) {
            return false;
        }
        return true;
    });
    addLabels = [...new Set(addLabels)];
    currentLabels = [...currentLabels, ...addLabels];
    currentLabels = [...new Set(currentLabels)];
    return currentLabels;
};


module.exports = {
    process
}