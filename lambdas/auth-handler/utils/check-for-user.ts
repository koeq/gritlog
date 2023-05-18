import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import jwt_decode from "jwt-decode";
import { ddbClient } from ".";

export interface GoogleUserData {
  email: string;
  email_verified: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export const checkForUser = async (body: string | null): Promise<boolean> => {
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
