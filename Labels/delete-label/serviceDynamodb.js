const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * Deletes a label from table
 * 
 * @param {Object} item label object
 * @returns {Object} Dynamodb response
 */
const deleteLabel = async (item) => {
    const params = {
        TableName: process.env.LabelTable,
        Key: {
            userId: item.userId,
            labelId: item.labelId
        }
    }

    try {
        const response = await documentClient.delete(params).promise();
        console.log(response);
        return {
            message: 'Successfully deleted Label',
            labelId: item.labelId
        };
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error deleting label from table');
    }
}

module.exports = {
    deleteLabel
}