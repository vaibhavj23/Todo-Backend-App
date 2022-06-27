/**
 * Mandatory Field missing error class
 */
class MandatoryFieldMissingError extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.httpCode = 400;
        this.message = message
    }
}

/**
 * Invalid Request error class
 */
class InvaildRequestError extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.httpCode = 400;
        this.message = message
    }
}

/**
 * Dynamodb access error class
 */
class DynamoDBAccessError extends Error {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.httpCode = 500;
        this.message = message
    }
}

module.exports = {
    MandatoryFieldMissingError,
    InvaildRequestError,
    DynamoDBAccessError
}
