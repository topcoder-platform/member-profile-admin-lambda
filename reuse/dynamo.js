'use strict';

const AWS = require('aws-sdk')
var dynamo = new AWS.DynamoDB.DocumentClient()

module.exports = {
  getByExpressionAttributes: async function (_tableName, _keyConditionExpression, _expressionAttributeNames, 
    _expressionAttributeValues) {
    const params = {
      TableName : _tableName,
      KeyConditionExpression: _keyConditionExpression,
      ExpressionAttributeNames: _expressionAttributeNames,
      ExpressionAttributeValues: _expressionAttributeValues
    }
    return dynamo.query(params).promise();
  },
  getByIndexName: async function (_tableName, _indexName, _keyConditionExpression, _expressionAttributeValues) {
    const params = {
      TableName: _tableName,
      IndexName: _indexName,
      KeyConditionExpression: _keyConditionExpression,
      ExpressionAttributeValues: _expressionAttributeValues
    }
    return dynamo.query(params).promise();
  }
};