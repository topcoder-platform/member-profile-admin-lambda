'use strict';

const member = require('../member')

let event = {
  "path": "/member/profile",
  "queryStringParameters": {
    "userId": "40154303",
    "handle": "upbeat"
  },
  "headers": {
    "Accept": "*/*"
  },
  "body": {
    "Message": "Testing data strcuture"
  }
}

// member.profile(event, {}, function (callback, result) {
//   console.log(result)
// })

member.profiletraits(event, {}, function (callback, result) {
  console.log(result)
})