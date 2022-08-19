import { marshall } from "@aws-sdk/util-dynamodb";
import { GoogleUserData } from "./check-for-user";
import jwt_decode from "jwt-decode";
import { buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";
import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";

export const deleteTraining = async (
  jwt: string | undefined,
  event: APIGatewayProxyEvent
) => {
  const { queryStringParameters, headers } = event;

  try {
    if (!jwt || !queryStringParameters?.id) {
      return buildResponse(500, "Can't delete training.", headers.origin);
    }

    const id = JSON.parse(queryStringParameters.id);

    const decoded: GoogleUserData = jwt_decode(jwt);
    const { email } = decoded;

    const params: DeleteItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id }),
    };

    const command = new DeleteItemCommand(params);
    const res = await ddbClient.send(command);

    return buildResponse(200, res, headers.origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Can't delete training.", headers.origin);
  }
};
