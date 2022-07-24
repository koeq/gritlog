import { GoogleUserData } from "./check-for-user";
import { buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";
import jwt_decode from "jwt-decode";
import { setAuthCookie } from "./set-auth-cookie";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

export const createUser = async (body: string | null) => {
  try {
    if (!body) {
      return buildResponse(500, "No body found");
    }

    const decoded: GoogleUserData = jwt_decode(body);
    const { email, given_name, family_name } = decoded;

    const params = {
      TableName: "users",
      Item: {
        email: { S: email },
        first_name: { S: given_name },
        surname: { S: family_name },
      },
    };

    const command = new PutItemCommand(params);
    await ddbClient.send(command);

    return setAuthCookie(201, body);
  } catch (err) {
    console.log(`Couldn't create user: ${err}`);

    return buildResponse(500, err);
  }
};
