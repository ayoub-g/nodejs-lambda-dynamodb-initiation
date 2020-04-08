const AWS = require("aws-sdk");
AWS.config.apiVersions = { dynamodb: "2012-08-10" };

exports.handler = async (event) => {
  let response = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
  if (event.body === undefined) {
    response.statusCode = 500;
    response.body = JSON.stringify("Error:Empty request");
  } else {
    const user = JSON.parse(event.body);

    if (
      user &&
      user.email &&
      user.firstname &&
      user.lastname &&
      user.age &&
      user.tel &&
      user.company &&
      user.adress
    ) {
      const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "eu-west-1",
      });
      const queryparams = {
        TableName: "users",
        Item: {
          id: "basic",
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          tel: user.tel,
          company: user.company,
          adress: user.adress,
        },
      };
      try {
        await documentClient.put(queryparams).promise();
        response.body = JSON.stringify(queryparams);
        response.statusCode = 200;
      } catch (err) {
        response.statusCode = 400;
        response.body = JSON.stringify(err);
      }
    } else {
      response.body = JSON.stringify("Missing fields");
      response.statusCode = 400;
    }
  }
  return response;
};
