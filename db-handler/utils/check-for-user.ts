import * as AWS from "aws-sdk";
import jwt_decode from "jwt-decode";
AWS.config.update({ region: "eu-central-1" });

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
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "users",
      Key: {
        email,
      },
    };

    const result = await ddb.get(params).promise();

    return result.Item;
  } catch (err) {
    console.log(err);

    return false;
  }
};
