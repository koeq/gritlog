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
  jwt: string | undefined,
  queryStringParameters: APIGatewayProxyEvent["queryStringParameters"]
): Promise<JsonResponse> => {
  try {
    if (!jwt || !queryStringParameters?.id) {
      return buildResponse(500, "Can't delete training");
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

    return buildResponse(200, res);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Can't delete training");
  }
};
