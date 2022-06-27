const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * retrieves todo data for particular todoId
 * 
 * @param {Object} item object with todo info
 * @returns {Object} response received from table
 */
const getOneTodo = async (item) => {
    const params = {
        TableName: process.env.TodoTable,
        Key: {
            userId: item.userId,
            todoId: item.todoId
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
            message: 'No todo found'
        }
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error getting todo/todos from table');
    }
}

/**
 * retrieves all todos data for particular user
 * 
 * @param {Object} item object with user info
 * @returns {Array} response received from table
 */
const getAllTodos = async (item) => {
    const params = {
        TableName: process.env.TodoTable,
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
        throw new DynamoDBAccessError('Error getting todo/todos from table');
    }
}

module.exports = {
    getOneTodo,
    getAllTodos
}