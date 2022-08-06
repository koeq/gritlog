import { marshall } from "@aws-sdk/util-dynamodb";
import { GoogleUserData } from "./check-for-user";
import jwt_decode from "jwt-decode";
import { buildResponse } from "./build-response";
import { ddbClient } from "./ddb-client";
import {
  DeleteItemCommand,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export const deleteTraining = async (
  jwt: string | undefined,
  queryParams: APIGatewayProxyEventQueryStringParameters | null
) => {
  try {
    if (!jwt || !queryParams?.id) {
      return buildResponse(500, "Can't delete training.");
    }

    const id = JSON.parse(queryParams.id);

    const decoded: GoogleUserData = jwt_decode(jwt);
    const { email } = decoded;

    const params: DeleteItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id }),
    };

    const command = new DeleteItemCommand(params);
    const res = await ddbClient.send(command);

    return buildResponse(200, res);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Can't delete training.");
  }
};
