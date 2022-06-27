'use strict';
const AWS = require('aws-sdk');
var ses = new AWS.SES();
const { SesAccessError } = require('./errorUtil');

/**
 * Sends email to user when reminder for a todo is updated/created/deleted
 * 
 * @param {Object} todoItem todo data
 * @param {String} reminderMessage indicates whether todo is updated/created/deleted
 */
const sendEmail = async (todoItem, reminderMessage) => {
    const params = {
        Destination: {
            ToAddresses: [todoItem.userId],
        },
        Message: {
            Body: {
                Text: { Data: `Hello ${todoItem.userId}. ${reminderMessage} for task ${todoItem.todoName} having todoId ${todoItem.todoId}` },
            },
            Subject: { Data: reminderMessage },
        },
        Source: "vaibhav.jambhale23@gmail.com", //needs to changed based on source email addresss
    };
    console.log(params);
    try {
        const response = await ses.sendEmail(params).promise();
        console.log(response);
    } catch (error) {
        console.log(error);
        throw new SesAccessError("Error while sending mail");
    }
};

module.exports = {
    sendEmail
}