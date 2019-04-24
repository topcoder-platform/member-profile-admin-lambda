'use strict';

const profile = require('../profile')

let event = {
  "path": "/profile/update",
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

profile.update(event, {}, function (callback, result) {
  console.log(result)
})