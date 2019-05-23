module.exports = {
  AUTH0: {
    M2M_AUTH_AUDIENCE: process.env.M2M_AUTH_AUDIENCE || "",
    M2M_AUTH_CLIENT_ID: process.env.M2M_AUTH_CLIENT_ID || "",
    M2M_AUTH_CLIENT_SECRET: process.env.M2M_AUTH_CLIENT_SECRET || "",
    M2M_AUTH_DOMAIN: process.env.M2M_AUTH_DOMAIN || ""
  },
  KAFKA: {
    KAFKA_URL: process.env.KAFKA_URL || "",
    UPDATE_PROFILE_TOPIC: process.env.UPDATE_PROFILE_TOPIC || "",
    UPDATE_PROFILE_TRAIT_TOPIC: process.env.UPDATE_PROFILE_TRAIT_TOPIC || "",
    ORIGINATOR: process.env.ORIGINATOR || ""
  }
}