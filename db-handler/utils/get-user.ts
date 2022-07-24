import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddb-client";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { buildResponse } from "./build-response";

export const getUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null
) => {
  try {
    if (!queryStringParameters || !queryStringParameters.email) {
      return buildResponse(500, "Missing query parameter");
    }

    const { email } = queryStringParameters;

    const params: GetItemCommandInput = {
      TableName: "users",
      Key: {
        email: {
          S: email,
        },
      },
    };

    const command = new GetItemCommand(params);
    const result = await ddbClient.send(command);

    return buildResponse(result.$metadata.httpStatusCode || 200, result.Item);
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
