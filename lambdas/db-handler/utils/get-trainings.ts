import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "../../utils";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";

export const getTrainings = async (
  jwt: string,
  origin: string | undefined
): Promise<JsonResponse> => {
  try {
    const decoded: GoogleUserData = jwt_decode(jwt);
    const { email } = decoded;

    const params: QueryCommandInput = {
      TableName: "trainings",
      KeyConditionExpression: "#key = :value",
      ExpressionAttributeNames: {
        "#key": "email",
      },
      ExpressionAttributeValues: marshall({
        ":value": email,
      }),
    };

    const command = new QueryCommand(params);
    const result = await ddbClient.send(command);

    if (result.$metadata.httpStatusCode !== 200 || !result.Items) {
      console.error(
        `Attempt to fetch trainings failed: DB replied with ${result.$metadata.httpStatusCode}.`
      );

      return buildResponse(500, `Unable to fetch trainings.`, origin);
    }

    const items = result.Items.map((item) => unmarshall(item));

    return buildResponse(200, items, origin);
  } catch (err) {
    console.error(err);

    return buildResponse(500, "Unable to fetch trainings.", origin);
  }
};
