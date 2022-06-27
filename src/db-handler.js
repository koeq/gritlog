const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-central-1",
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = "trainings";
const trainingPath = "/training";

exports.handler = async function (event) {
  console.log("Request event: ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === trainingPath:
      response = buildResponse(200);
      break;

    default:
      response = buildResponse(404, "404 not found");
  }

  return response;
};

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
