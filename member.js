'use strict';

const util = require('./reuse/util')
const dynamo = require('./reuse/dynamo')
const auth0 = require('./reuse/auth0')
const kafka = require('./reuse/kafka')

module.exports.profile = async (event, context, callback) => {
  //const { path, queryStringParameters, headers, body } = event
  if (event['queryStringParameters']) {
    const { queryStringParameters } = event;
    switch(true) {
      case queryStringParameters.hasOwnProperty('userId'): 
        console.log("Query by UserId - " + queryStringParameters.userId)
        var memberProfile = await dynamo.getByExpressionAttributes("MemberProfile", "#userId = :userId", { "#userId": "userId" }, { ":userId": Number(queryStringParameters.userId) })
        switch(memberProfile.Count) {
          case 0: 
            console.log(util.immediateResponse(404))
            callback(null, util.immediateResponse(404))
            break;
          case 1:
            var memberProfileSanitized = util.dataSanitizer(memberProfile.Items[0])
            console.log("Member Found - UserId: " + memberProfileSanitized.userId + ", Handle: " + memberProfileSanitized.handle)
            var m2mToken = await auth0.getM2MToken()
            console.log("Token Fetched")
            var kafkaResponse = await kafka.fireEvent(memberProfileSanitized, m2mToken.data.access_token, 'UPDATE_PROFILE_TOPIC')
            switch(kafkaResponse.status) {
              case 204: 
                console.log(util.immediateResponse(200))
                callback(null, util.immediateResponse(200))
                break;
              default:
                console.log(util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
                callback(null, util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
                break;
            }
            break;
          default:
            console.log(util.immediateResponse(406))
            callback(null, util.immediateResponse(406))
            break;
        }
        break;
      case queryStringParameters.hasOwnProperty('handle'):
        console.log("Query by Handle - " + queryStringParameters.handle)
        var memberProfile = await dynamo.getByIndexName("MemberProfile", "handleLower-index", "handleLower = :handleLower", { ":handleLower": queryStringParameters.handle })
        switch(memberProfile.Count) {
          case 0: 
            console.log(util.immediateResponse(404))
            callback(null, util.immediateResponse(404))
            break;
          case 1:
            var memberProfileSanitized = util.dataSanitizer(memberProfile.Items[0])
            console.log("Member Found - UserId: " + memberProfileSanitized.userId + ", Handle: " + memberProfileSanitized.handle)
            var m2mToken = await auth0.getM2MToken()
            console.log("Token Fetched")
            var kafkaResponse = await kafka.fireEvent(memberProfileSanitized, m2mToken.data.access_token, 'UPDATE_PROFILE_TOPIC')
            switch(kafkaResponse.status) {
              case 204: 
                console.log(util.immediateResponse(200))
                callback(null, util.immediateResponse(200))
                break;
              default:
                console.log(util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
                callback(null, util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
                break;
            }
            break;
          default:
            console.log(util.immediateResponse(406))
            callback(null, util.immediateResponse(406))
            break;
        }
        break;
      default:
        console.log(util.immediateResponse(503))
        callback(null, util.immediateResponse(503))
    }
  } else {
    console.log(util.immediateResponse(501))
    callback(null, util.immediateResponse(501))
  }
};

module.exports.profiletraits = async (event, context, callback) => {
  if (event['queryStringParameters']) {
    const { queryStringParameters } = event;
    switch(true) {
      case queryStringParameters.hasOwnProperty('userId'): 
        console.log("Query by UserId - " + queryStringParameters.userId)
        var memberProfileTraits = await dynamo.getByExpressionAttributes("MemberProfileTrait", "#userId = :userId", { "#userId": "userId" }, { ":userId": Number(queryStringParameters.userId) })
        console.log(memberProfileTraits.Count + " - Member Traits Found - UserId: " + queryStringParameters.userId)
        var m2mToken = await auth0.getM2MToken()
        console.log("Token Fetched")
        for(let counter = 0; counter < memberProfileTraits.Count; counter++) {
          var memberProfileTraitSanitized = util.dataSanitizer(memberProfileTraits.Items[counter])
          console.log("Data Sanatized for trait - " + memberProfileTraitSanitized.traitId)
          var kafkaResponse = await kafka.fireEvent(memberProfileTraitSanitized, m2mToken.data.access_token, 'UPDATE_PROFILE_TRAIT_TOPIC')
          switch(kafkaResponse.status) {
            case 204: 
              console.log(util.immediateResponse(200))
              util.storeResponse(memberProfileTraitSanitized.traitId, 200)
              break;
            default:
              console.log(util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
              util.storeResponse(memberProfileTraitSanitized.traitId, kafkaResponse.status, kafkaResponse.statusText)
              break;
          }
        }
        callback(null, util.fetchResponse())
        break;
      case queryStringParameters.hasOwnProperty('handle'):
        console.log("Query by Handle - " + queryStringParameters.handle)
        var memberProfile = await dynamo.getByIndexName("MemberProfile", "handleLower-index", "handleLower = :handleLower", { ":handleLower": queryStringParameters.handle })
        switch(memberProfile.Count) {
          case 0: 
            console.log(util.immediateResponse(404))
            callback(null, util.immediateResponse(404))
            break;
          case 1:
            var memberProfileTraits = await dynamo.getByExpressionAttributes("MemberProfileTrait", "#userId = :userId", { "#userId": "userId" }, { ":userId": Number(memberProfile.Items[0].userId) })
            console.log(memberProfileTraits.Count + " - Member Traits Found - Handle: " + memberProfile.Items[0].handle)
            var m2mToken = await auth0.getM2MToken()
            console.log("Token Fetched")
            for(let counter = 0; counter < memberProfileTraits.Count; counter++) {
              var memberProfileTraitSanitized = util.dataSanitizer(memberProfileTraits.Items[counter])
              console.log("Data Sanatized for trait - " + memberProfileTraitSanitized.traitId)
              var kafkaResponse = await kafka.fireEvent(memberProfileTraitSanitized, m2mToken.data.access_token, 'UPDATE_PROFILE_TRAIT_TOPIC')
              switch(kafkaResponse.status) {
                case 204: 
                  console.log(util.immediateResponse(200))
                  util.storeResponse(memberProfileTraitSanitized.traitId, 200)
                  break;
                default:
                  console.log(util.immediateResponse(kafkaResponse.status, kafkaResponse.statusText))
                  util.storeResponse(memberProfileTraitSanitized.traitId, kafkaResponse.status, kafkaResponse.statusText)
                  break;
              }
            }
            callback(null, util.fetchResponse())
            break;
          default:
            console.log(util.immediateResponse(406))
            callback(null, util.immediateResponse(406))
            break;
        }
        break;
      default:
        console.log(util.immediateResponse(503))
        callback(null, util.immediateResponse(503))
    }
  } else {
    console.log(util.immediateResponse(501))
    callback(null, util.immediateResponse(501))
  }
};