const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * Creates request params for creatng/updating a todo
 * 
 * @param {Object} item todo data
 * @returns {Object} dynamo request params
 */
const createDynamoRequest = (item) => {
    const itemData = Object.entries(item);
    const { setExprs, nameExprs, valueExprs } = itemData.reduce((acc, curr) => {
        const nameKey = `#${curr[0]}`;
        const valKey = `:${curr[0]}`;
        acc.setExprs.push(`${nameKey} = ${valKey}`);
        acc.nameExprs[nameKey] = curr[0];
        acc.valueExprs[valKey] = curr[1];
        return acc;
    }, {
        setExprs: [],
        nameExprs: {},
        valueExprs: {}
    });

    return {
        UpdateExpression: 'SET ' + setExprs.join(', '),
        ExpressionAttributeNames: nameExprs,
        ExpressionAttributeValues: valueExprs
    };

}

/**
 * Creates/Updates a todo in table
 * 
 * @param {Object} item todo data
 * @returns {Object} response of creating a todo
 */
const createTodo = async (item) => {
    const userId = item.userId;
    const todoId = item.todoId;
    delete item.userId;
    delete item.todoId;

    const updateExp = createDynamoRequest(item);
    const params = {
        TableName: process.env.TodoTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ...updateExp,
        ReturnValues: 'ALL_NEW'
    };
    console.log(params);

    try {
        const response = await documentClient.update(params).promise();
        console.log(response);
        return response.Attributes;
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('DynammoDB access error');
    }
}

/**
 * Retrieves todo data from tables
 * 
 * @param {Object} item item with todo id
 * @returns {Object} response with todo data
 */
const getTodo = async (item) => {
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
        return {};
    } catch (error) {
        console.log(error);
        throw new DynamoDBAccessError('Error getting todo/todos from table');
    }
}

module.exports = {
    createTodo,
    getTodo
}