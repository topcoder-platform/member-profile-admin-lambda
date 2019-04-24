'use strict';

const axios = require("axios")
const config = require('config')

module.exports = {
  getM2MToken: async function () {
    var m2mToken = axios.post(config.get('AUTH0.M2M_AUTH_DOMAIN') + '/oauth/token',
      {
        "client_id": config.get('AUTH0.M2M_AUTH_CLIENT_ID'),
        "client_secret": config.get('AUTH0.M2M_AUTH_CLIENT_SECRET'),
        "audience": config.get('AUTH0.M2M_AUTH_AUDIENCE'),
        "grant_type": "client_credentials"
      }
    )
    return m2mToken;
  }
};