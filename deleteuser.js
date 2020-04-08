const AWS = require("aws-sdk");
AWS.config.apiVersions = { dynamodb: "2012-08-10" };
exports.handler = async (event) => {
  let response = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  if (event.pathParameters && event.pathParameters.email) {
    const documentClient = new AWS.DynamoDB.DocumentClient({
      region: "eu-west-1",
    });
    try {
      const queryparams = {
        TableName: "users",
        Key: {
          id: "basic",
          email: parseInt(event.pathParameters.timestamp),
        },
      };
      const res = await documentClient.delete(queryparams).promise();
      response.body = JSON.stringify(res);
      response.statusCode = 200;
    } catch (err) {
      response.body = JSON.stringify(err);
      response.statusCode = 400;
    }
  } else {
    response.statusCode = 400;
    response.body = JSON.stringify("Error : Missing query parameters");
  }
  return response;
};
