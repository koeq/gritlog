import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import jwt_decode from "jwt-decode";
import { ddbClient } from "./ddb-client";

export interface GoogleUserData {
  iss: string;
  nbf: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: string;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

export const checkForUser = async (body: string | null) => {
  if (!body) {
    return false;
  }

  try {
    const decoded: GoogleUserData = jwt_decode(body);
    const { email } = decoded;

    const params: GetItemCommandInput = {
      TableName: "users",
      Key: {
        email: {
          S: email,
        },
      },
    };

    const command = new GetItemCommand(params);
    const result = await ddbClient.send(command);

    if (!result.Item) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};
