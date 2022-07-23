import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { buildResponse } from "./build-response";
import * as AWS from "aws-sdk";
AWS.config.update({ region: "eu-central-1" });

const ddb = new AWS.DynamoDB.DocumentClient();

export const getUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null
) => {
  if (!queryStringParameters || !queryStringParameters.email) {
    return buildResponse(500, "Missing query parameter");
  }

  try {
    const { email } = queryStringParameters;
    var params = {
      TableName: "users",
      Key: {
        email,
      },
    };

    const result = await ddb.get(params).promise();

    return buildResponse(result.$response.httpResponse.statusCode, result.Item);
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
