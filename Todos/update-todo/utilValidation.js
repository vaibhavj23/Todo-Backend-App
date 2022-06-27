const { MandatoryFieldMissingError, InvaildRequestError } = require('./errorUtil');
const {
    CREATE_MODE,
    UPDATE_MODE
} = require('./constants');

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
        return CREATE_MODE;
    } else if (event.resource === '/v1/todoapp/user/{userId}/todo/{todoId}') {
        return UPDATE_MODE;
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
    const body = parseEventBody(event);
    let addLabels = '';
    let removeLabels = '';
    let deleteReminder;
    let isReminderModified = false;
    let reminderMessage;
    if (mode === CREATE_MODE && !isValidField(body.todoName)) {
        throw new MandatoryFieldMissingError('todoName missing in Request Body');
    }
    if (isValidField(event.queryStringParameters)) {
        addLabels = isValidField(event.queryStringParameters.addLabels) ? event.queryStringParameters.addLabels : '';
        removeLabels = isValidField(event.queryStringParameters.removeLabels) ? event.queryStringParameters.removeLabels : '';
        deleteReminder = event.queryStringParameters.deleteReminder === 'true';
    }

    if (mode === UPDATE_MODE && (isValidField(addLabels) || isValidField(removeLabels))) {
        addLabels = isValidField(addLabels) ? addLabels.split(',') : [];
        removeLabels = isValidField(removeLabels) ? removeLabels.split(',') : [];
    }
    const userId = event.pathParameters.userId;
    const todoId = event.pathParameters.todoId;

    // set isReminderModified to true if event has reminder
    if (isValidField(body.reminder) && !deleteReminder) {
        validateReminder(body.reminder);
        isReminderModified = true;
    } else {
        body.reminder = null;
    }
    if (deleteReminder) isReminderModified = true, reminderMessage = 'Reminder Deleted';
    return Object.assign({},
        body,
        { userId, todoId, addLabels, removeLabels, isReminderModified, reminderMessage }
    );
}

/**
 * parse json body in event
 *
 * @param {object} event the event
 * @returns {object} body event body
 */
const parseEventBody = (event) => {
    if (!isValidField(event.body)) {
        throw new MandatoryFieldMissingError('Body Missing in Request');
    } else {
        try {
            return JSON.parse(event.body);
        } catch (error) {
            throw new InvaildRequestError('Invalid Request Body');
        }
    }
};

/**
 * Validates whether reminder sent in correct format
 * 
 * @param {String} reminder datetime string received from request
 */
const validateReminder = (reminder) => {
    const currentTime = new Date().getTime();
    if (RegExp('^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2}([.]\\d{1,})?)?[zZ]$').test(reminder) === true && !isValidField(reminder)) {
        throw new InvaildRequestError("Reminder Date is not in correct format")
    } else if (currentTime >= new Date(reminder).getTime()) {
        throw new InvaildRequestError("Reminder time is less than current time")
    }
}

module.exports = {
    requestMode,
    getRequestData,
    isValidField
}