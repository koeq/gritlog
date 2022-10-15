import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { JsonResponse, buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";

export const deleteUser = async (
  event: APIGatewayProxyEvent
): Promise<JsonResponse> => {
  const { queryStringParameters } = event;

  if (!queryStringParameters || !queryStringParameters.email) {
    return buildResponse(500, "Missing query parameter");
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

    return buildResponse(202, "User will be deleted");
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
