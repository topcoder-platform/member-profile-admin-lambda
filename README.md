
# Member Profile - Admin Lambda
Service that will make member data consistent across Topcoder.

End point allows to pass member *UserId* / *Handle* as query parameter. In turn will fetch the member data from DynamoDB and valid machine token from Auth0 to communicate with Kafka. Once the json payload is passed to Kafka for a particular topic, Kafka listeners in our case the Elasticsearch & Informix processors would receive the payload and would process accordingly. Synchronising the data across Topcoder data stores.

### Deploy this function into the AWS. Use the following command:
Add file `./config/dev.json`

    {
      "M2M_AUTH_AUDIENCE": "",
      "M2M_AUTH_CLIENT_ID": "",
      "M2M_AUTH_CLIENT_SECRET": "",
      "M2M_AUTH_DOMAIN": "",
      "KAFKA_URL": "",
      "UPDATE_PROFILE_TOPIC": "",
      "UPDATE_PROFILE_TRAIT_TOPIC": "",
      "ORIGINATOR": "member.profile.admin.lambda",
      "LAMBDA_ROLE": ""
    }
Add the configuration values accordingly

Now lets deploy to dev or prod based on the asw profile configured on your system.

    $ serverless deploy --aws-profile tcdev

### Invoking the Service:
We can pass either *UserId* / *Handle* as query parameter.

Example:

    https://8hqm3g1j24.execute-api.us-east-1.amazonaws.com/dev/profile/update?handle=abcdef

    https://8hqm3g1j24.execute-api.us-east-1.amazonaws.com/dev/profile/update?userId=123456

### View cloud watch logs using CW
Using CW tool we can access the clod watch logs in our console.

    $ cw tail -f /aws/lambda/member-profile-admin-lambda-dev-member --profile=tcdev

### Local Testing
 When you want to run this locally, just use the following command:

    $ export M2M_AUTH_AUDIENCE=""; export M2M_AUTH_CLIENT_ID=""; export M2M_AUTH_CLIENT_SECRET=""; export M2M_AUTH_DOMAIN=""; export KAFKA_URL=""; export UPDATE_PROFILE_TOPIC="member.action.profile.update"; export UPDATE_PROFILE_TRAIT_TOPIC="member.action.profile.trait.update"; export ORIGINATOR="member.profile.admin.lambda"; export AWS_ACCESS_KEY_ID=""; export AWS_SECRET_ACCESS_KEY=""; export AWS_REGION="us-east-1"; npm test;
