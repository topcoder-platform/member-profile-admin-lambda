'use strict';

const fs = require("fs");
const util = require('util')
const responseDetails = {
  200: "Ok, Success",
  404: "Member Not Found in DynamoDB",
  406: "Not Acceptable, Multiple Members Found",
  503: "Service Unavailable, Recheck Query Parameter",
  501: "Not Implemented, Query Parameter Expected"
}
var outputResponse = ""

module.exports = {
  immediateResponse: function (_statusCode, _body) {
    if(_body) {
      return { statusCode: _statusCode, body: _body }
    } else {
      return { statusCode: _statusCode, body: responseDetails[_statusCode] }
    }
  },
  storeResponse: function (_id, _statusCode, _body) {
    if(_body) {
      outputResponse = outputResponse + "Trait Id : " + _id + ", Status Code : " + _statusCode + ", Status Response : " + _body + ". ";
    } else {
      outputResponse = outputResponse + "Trait Id : " + _id + ", Status Code : " + _statusCode + ", Status Response : " + responseDetails[_statusCode] + ". ";
    }
  },
  fetchResponse: function () {
    var response = outputResponse;
    outputResponse = "";
    return { statusCode: 200, body: response }
  },
  dataSanitizer: function (_data) {
    if(_data.hasOwnProperty("addresses")) {
      _data.addresses = JSON.parse(_data.addresses);
    }
    if(_data.hasOwnProperty("traits")) {
      _data.traits = JSON.parse(_data.traits);
    }
    return _data
  },
  storeToFile: function (_data, _fileName) {
    fs.writeFile("./" + _fileName, JSON.stringify( util.inspect(_data) ), function(err) {
      if(err) {
        return console.log(err);
      }
    });
  }
};
