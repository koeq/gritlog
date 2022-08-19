import { marshall } from "@aws-sdk/util-dynamodb";
import { GoogleUserData } from "./check-for-user";
import jwt_decode from "jwt-decode";
import { buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Training } from "../types";
import { APIGatewayProxyEvent } from "aws-lambda";

export const addTraining = async (
  jwt: string | undefined,
  event: APIGatewayProxyEvent
) => {
  const { body, headers } = event;

  try {
    if (!jwt) {
      return buildResponse(401, "Not authenticated", headers.origin);
    }

    if (!body) {
      return buildResponse(500, "Can't add user.", headers.origin);
    }

    const training = JSON.parse(body) as Training;
    const decoded: GoogleUserData = jwt_decode(jwt);
    const { email } = decoded;

    const params = {
      TableName: "trainings",
      Item: marshall({ ...training, email }),
    };

    const command = new PutItemCommand(params);
    const res = await ddbClient.send(command);

    return buildResponse(200, res, headers.origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Can't add user.", headers.origin);
  }
};
