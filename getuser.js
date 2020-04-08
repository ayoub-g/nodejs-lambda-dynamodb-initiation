const AWS = require("aws-sdk");
AWS.config.apiVersions = { dynamodb: "2012-08-10" };

let response = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};
exports.handler = async (event) => {
  if (event.pathParameters && event.pathParameters.email) {
    const queryparams = {
      TableName: "users",
      Key: {
        id: "basic",
        email: user.email,
      },
    };
    const documentClient = new AWS.DynamoDB.DocumentClient({
      region: "eu-west-1",
    });
    try {
      const data = await documentClient.get(queryparams).promise();
      if (data.Item === undefined) {
        response.body = JSON.stringify("user not found");
      } else {
        response.body = JSON.stringify(data.Item);
      }
      response.statusCode = 200;
    } catch (err) {
      response.statusCode = 400;
      response.body = { err };
    }
  } else {
    response.body = JSON.stringify("invalid query parameter");
    response.statusCode = 400;
  }
  return response;
};
