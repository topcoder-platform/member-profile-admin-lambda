'use strict';

const util = require('./reuse/util')
const dynamo = require('./reuse/dynamo')
const auth0 = require('./reuse/auth0')
const kafka = require('./reuse/kafka')

module.exports.update = async (event, context, callback) => {
  //const { path, queryStringParameters, headers, body } = event
  if (event['queryStringParameters']) {
    const { queryStringParameters } = event;
    switch(true) {
      case queryStringParameters.hasOwnProperty('userId'): 
        console.log("Query by UserId - " + queryStringParameters.userId)
        var memberProfile = await dynamo.getByExpressionAttributes("MemberProfile", "#userId = :userId", { "#userId": "userId" }, { ":userId": Number(queryStringParameters.userId) })
        switch(memberProfile.Count) {
          case 0: 
            console.log(util.response(404))
            callback(null, util.response(404))
            break;
          case 1:
            var memberProfileSanitized = util.dataSanitizer(memberProfile.Items[0])
            console.log("Member Found - UserId: " + memberProfileSanitized.userId + ", Handle: " + memberProfileSanitized.handle)
            var m2mToken = await auth0.getM2MToken()
            console.log("Token Fetched")
            var kafkaResponse = await kafka.fireEvent(memberProfileSanitized, m2mToken.data.access_token)
            switch(kafkaResponse.status) {
              case 204: 
                console.log(util.response(200))
                callback(null, util.response(200))
                break;
              default:
                console.log(util.response(kafkaResponse.status, kafkaResponse.statusText))
                callback(null, util.response(kafkaResponse.status, kafkaResponse.statusText))
                break;
            }
            break;
          default:
            console.log(util.response(406))
            callback(null, util.response(406))
            break;
        }
        break;
      case queryStringParameters.hasOwnProperty('handle'):
        console.log("Query by Handle - " + queryStringParameters.handle)
        var memberProfile = await dynamo.getByIndexName("MemberProfile", "handleLower-index", "handleLower = :handleLower", { ":handleLower": queryStringParameters.handle })
        switch(memberProfile.Count) {
          case 0: 
            console.log(util.response(404))
            callback(null, util.response(404))
            break;
          case 1:
            var memberProfileSanitized = util.dataSanitizer(memberProfile.Items[0])
            console.log("Member Found - UserId: " + memberProfileSanitized.userId + ", Handle: " + memberProfileSanitized.handle)
            var m2mToken = await auth0.getM2MToken()
            console.log("Token Fetched")
            var kafkaResponse = await kafka.fireEvent(memberProfileSanitized, m2mToken.data.access_token)
            switch(kafkaResponse.status) {
              case 204: 
                console.log(util.response(200))
                callback(null, util.response(200))
                break;
              default:
                console.log(util.response(kafkaResponse.status, kafkaResponse.statusText))
                callback(null, util.response(kafkaResponse.status, kafkaResponse.statusText))
                break;
            }
            break;
          default:
            console.log(util.response(406))
            callback(null, util.response(406))
            break;
        }
        break;
      default:
        console.log(util.response(503))
        callback(null, util.response(503))
    }
  } else {
    console.log(util.response(501))
    callback(null, util.response(501))
  }
};