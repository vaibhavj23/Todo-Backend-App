const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * Deletes a todo from table
 * 
 * @param {Object} item todo object
 * @returns {Object} Dynamodb response
 */
const deleteTodo = async (item) => {
    const params = {
        TableName: process.env.TodoTable,
        Key: {
            userId: item.userId,
            todoId: item.todoId
        }
    }
    console.log(params);
    try {
        const response = await documentClient.delete(params).promise();
        console.log(response);
        return {
            message: 'Successfully deleted Todo',
            todoId: item.todoId
        };
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error deleting todo from table');
    }
}

/**
 * Deletes multiple todos for a user using batch operation
 * 
 * @param {Object} payload object having todoIds to be deleted for a user
 * @returns {Object} response of deletion operation
 */
const batchDeleteTodos = async (payload) => {
    const deteteBatch = createDeleteBatch(payload);
    const tableName = process.env.TodoTable;
    const params = {
        RequestItems: {
            [tableName]: deteteBatch
        }
    };
    console.log(params);
    try {
        const response = await documentClient.batchWrite(params).promise();
        console.log(response);
        if (Object.keys(response.UnprocessedItems).length === 0) {
            return {
                message: 'Successfully deleted todos',
                todoIds: payload.todoIds
            };
        }
        return response;
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error batch deleting todos from table');
    }
}

const createDeleteBatch = (payload) => {
    const userId = payload.userId;
    const todoIds = payload.todoIds;
    let deleteBatch = []
    todoIds.forEach(todoId => {
        const deleteObj = {
            DeleteRequest: {
                Key: {
                    userId: userId,
                    todoId: todoId
                }
            }
        };
        deleteBatch.push(deleteObj);
    });
    return deleteBatch;
}

module.exports = {
    deleteTodo,
    batchDeleteTodos
}