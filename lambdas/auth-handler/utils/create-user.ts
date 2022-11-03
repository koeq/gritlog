import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";
import { setAuthCookie } from "./set-auth-cookie";

export const createUser = async (
  event: APIGatewayProxyEvent
): Promise<JsonResponse> => {
  const { body } = event;
  try {
    if (!body) {
      return buildResponse(500, "No body found");
    }

    const decoded: GoogleUserData = jwt_decode(body);

    const { email, given_name, family_name } = decoded;

    const params = {
      TableName: "users",
      Item: marshall({
        email,
        first_name: given_name || "",
        surname: family_name || "",
      }),
    };

    const command = new PutItemCommand(params);
    await ddbClient.send(command);

    return setAuthCookie(201, event);
  } catch (err) {
    console.log(`Couldn't create user: ${err}`);

    return buildResponse(500, err);
  }
};
