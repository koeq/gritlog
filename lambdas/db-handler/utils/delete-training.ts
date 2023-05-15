import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";

export const deleteTraining = async (
  jwt: string,
  queryStringParameters: APIGatewayProxyEvent["queryStringParameters"],
  origin: string | undefined
): Promise<JsonResponse> => {
  try {
    if (!queryStringParameters?.id) {
      console.error("Unable to delete training: Missing id.");

      return buildResponse(500, "Unable to delete training.", origin);
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

    return buildResponse(200, res, origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Unable to delete training.", origin);
  }
};
