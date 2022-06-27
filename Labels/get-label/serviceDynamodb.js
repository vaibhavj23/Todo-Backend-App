const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * retrieves label data for particular labelId
 * 
 * @param {Object} item object with label info
 * @returns {Object} response received from table
 */
const getOneLabel = async (item) => {
    const params = {
        TableName: process.env.LabelTable,
        Key: {
            userId: item.userId,
            labelId: item.labelId
        }
    }
    console.log(params);
    try {
        const response = await documentClient.get(params).promise();
        console.log(response);
        if (response.Item) {
            return response.Item;
        };
        return {
            message: 'No label found'
        }
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error getting label/labels from table');
    }
}

/**
 * retrieves all labels data for particular user
 * 
 * @param {Object} item object with user info
 * @returns {Array} response received from table
 */
const getAllLabels = async (item) => {
    const params = {
        TableName: process.env.LabelTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ':userId': item.userId
        }
    }
    console.log(params);
    try {
        const response = await documentClient.query(params).promise();
        console.log(response);
        return response.Items
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error getting label/labels from table');
    }
}

module.exports = {
    getOneLabel,
    getAllLabels
}