const AWS = require("aws-sdk");
AWS.config.apiVersions = { dynamodb: "2012-08-10" };
let response = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1",
});
exports.handler = async (event) => {
  if (event.body === undefined) {
    response.statusCode = 500;
    response.body = JSON.stringify("Error:Empty request");
    return response;
  }
  const user = JSON.parse(event.body);
  if (
    user &&
    user.email &&
    user.firstname &&
    user.lastname &&
    user.age &&
    user.tel &&
    user.company &&
    user.address
  ) {
    const updateQueryParams = {
      TableName: "users",
      Key: { id: "basic", email: user.email },
      UpdateExpression:
        "set firstname=:fn,lastname=:ln,age=:ag,tel=:tl,company=:cm,address:ad",
      ExpressionAttributeValues: {
        ":fn": user.firstname,
        ":ln": user.lastname,
        ":ag": user.age,
        ":tl": user.tel,
        ":cm": user.company,
        ":ad": user.address,
      },
    };
    try {
      await documentClient.update(updateQueryParams).promise();
      response.body = JSON.stringify("user updated");
      response.statusCode = 200;
    } catch (err) {
      response.statusCode = 400;
      response.body = JSON.stringify(err);
    }
  } else {
    response.body = JSON.stringify("Error: Missing advice fields");
    response.statusCode = 400;
  }
  return response;
};
