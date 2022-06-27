const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const { DynamoDBAccessError } = require('./errorUtil');

/**
 * Creates request params for creatng/updating a label
 * 
 * @param {Object} item label data
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
 * Creates/Updates a label in table
 * 
 * @param {Object} item label data
 * @returns {Object} response of creating a label
 */
const createLabel = async (item) => {
    const userId = item.userId;
    const labelId = item.labelId;
    delete item.userId;
    delete item.labelId;

    const updateExp = createDynamoRequest(item);
    const params = {
        TableName: process.env.LabelTable,
        Key: {
            userId: userId,
            labelId: labelId
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

module.exports = {
    createLabel
}