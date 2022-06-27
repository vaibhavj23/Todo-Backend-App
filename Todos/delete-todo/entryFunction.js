'use strict';
const service = require('./service');

/**
 * Return Success method
 *
 * @param {Object} body Response body
 * @param {Function} callback function
 * @param {integer} [statusCode=200] HTTP status code
 * @param {Object} [headers={}] Response headers
 * @param {boolean} isBase64Encoded indicated whether response body is encoded
 */
const returnSuccess = (body,callback, statusCode=200, headers={}, isBase64Encoded=false) => {
    callback(null,
        {
            statusCode: statusCode,
            headers: headers,
            body: JSON.stringify(body),
            isBase64Encoded: isBase64Encoded
        });
};

/**
 * Return error method
 * 
 * @param {Object} error received from service
 * @param {Function} callback callback function
 * @param {Object} headers [headers={}] Response headers
 * @param {Boolean} isBase64Encoded indicated whether response body is encoded
 */
const returnError = (error,callback, headers={}, isBase64Encoded=false) => {
    callback(null,
        {
            statusCode: error.httpCode,
            headers: headers,
            body: JSON.stringify({
            message: error.message,
            name: error.name
        }),
            isBase64Encoded: isBase64Encoded
        });
};

/**
 * handler method
 * 
 * @param {Object} event event object received from event
 * @param {Object} context context obj received
 * @param {Function} callback callback function
 */
module.exports.handler = async function (event, context, callback) {
    console.log(event);
    // Setup service context for AWS
    
    try {
        const response = await service.process(event);
        returnSuccess(response,callback);
    } catch (err) {
       console.log(err);
       returnError(err, callback);
    }
};
