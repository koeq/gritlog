import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { Training } from "./../types";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";

export const editTraining = async (
  jwt: string | undefined,
  event: APIGatewayProxyEvent
): Promise<JsonResponse> => {
  const { body } = event;

  try {
    if (!jwt || !body) {
      return buildResponse(500, "Can't update training.");
    }

    const training = JSON.parse(body) as Training;
    const decoded: GoogleUserData = jwt_decode(jwt);
    const { email } = decoded;

    const marshalledExercises = marshall({ exercises: training.exercises })[
      "exercises"
    ];

    if (!marshalledExercises) {
      return buildResponse(500, "Can't update training.");
    }

    const params: UpdateItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id: training.id }),
      UpdateExpression: "set exercises = :newExercises",
      ExpressionAttributeValues: {
        ":newExercises": marshalledExercises,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    await ddbClient.send(command);

    return buildResponse(200, "Edited training");
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Can't update training.");
  }
};
