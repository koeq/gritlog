import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";

export const deleteUser = async (event: APIGatewayProxyEvent) => {
  const { queryStringParameters, headers } = event;

  if (!queryStringParameters || !queryStringParameters.email) {
    return buildResponse(500, "Missing query parameter", headers.origin);
  }

  try {
    const { email } = queryStringParameters;

    const params: DeleteItemCommandInput = {
      TableName: "users",
      Key: {
        email: {
          S: email,
        },
      },
    };

    const command = new DeleteItemCommand(params);
    await ddbClient.send(command);

    return buildResponse(202, "User will be deleted", headers.origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, err, headers.origin);
  }
};
