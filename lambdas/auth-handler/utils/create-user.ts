import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";
import { setAuthCookie } from "./set-auth-cookie";

export const createUser = async (
  body: APIGatewayProxyEvent["body"]
): Promise<JsonResponse> => {
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

    const {
      $metadata: { httpStatusCode },
    } = await ddbClient.send(command);

    if (httpStatusCode !== 200) {
      throw Error(
        `Unable to create new user. Database replied with ${httpStatusCode}`
      );
    }

    const response = setAuthCookie(201, body);
    response.body = JSON.stringify("Created new user");

    return response;
  } catch (err) {
    console.log(`Couldn't create user: ${err}`);

    return buildResponse(500, err);
  }
};
