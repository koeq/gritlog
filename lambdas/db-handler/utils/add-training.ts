import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";
import { Training } from "../types";

export const addTraining = async (
  jwt: string,
  body: APIGatewayProxyEvent["body"],
  origin: string | undefined
): Promise<JsonResponse> => {
  try {
    if (!body) {
      console.error("Unable to add training: Missing training.");

      return buildResponse(500, "Unable to add training.", origin);
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

    return buildResponse(200, res, origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Unable to add training.", origin);
  }
};
