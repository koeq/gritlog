import jwt_decode from "jwt-decode";
import { buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const getTrainings = async (
  jwt: string | undefined,
  event: APIGatewayProxyEvent
) => {
  const { headers } = event;

  if (!jwt) {
    return buildResponse(500, "Error: Can't fetch trainings.", headers.origin);
  }

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

    if (!result.Items) {
      return buildResponse(200, "No trainings found.", headers.origin);
    }

    const items = result.Items.map((item) => unmarshall(item));

    return buildResponse(200, items, headers.origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Error: Can't fetch trainings.", headers.origin);
  }
};
