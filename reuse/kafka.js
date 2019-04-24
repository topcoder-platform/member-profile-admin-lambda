'use strict';

const axios = require("axios")
const moment = require('moment')
const config = require('config')

module.exports = {
  fireEvent: async function (_memberProfile, _m2mAccessToken) {
    var body = {}
    body["topic"] = config.get('KAFKA.UPDATE_PROFILE_TOPIC')
    body["mime-type"] = "application/json"
    body["originator"] = config.get('KAFKA.ORIGINATOR')
    body["timestamp"] = moment().format()
    body["payload"] = _memberProfile
    return axios.post(config.get('KAFKA.KAFKA_URL'), body, {
      headers: { Authorization: "Bearer " + _m2mAccessToken }
    })
  }
};