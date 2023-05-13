import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, buildResponse } from "./build-response";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";
import { Training } from "../types";

export const editTraining = async (
  jwt: string | undefined,
  body: APIGatewayProxyEvent["body"]
): Promise<JsonResponse> => {
  try {
    if (!jwt || !body) {
      return buildResponse(500, "Can't update training.");
    }

    const training = JSON.parse(body) as Training;
    const { email }: GoogleUserData = jwt_decode(jwt);

    const marshalledExercises = marshall({ exercises: training.exercises })[
      "exercises"
    ];

    const marshalledHeadline = marshall({ headline: training.headline })[
      "headline"
    ];

    const marshalledDate = marshall({ date: training.date })["date"];

    const params: UpdateItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id: training.id }),
      UpdateExpression:
        "set exercises = :newExercises, headline = :newHeadline, #date_attr = :newDate",
      // Date is a reserved keyword within dynamoDB and need to be mapped
      ExpressionAttributeNames: {
        "#date_attr": "date",
      },
      ExpressionAttributeValues: {
        ":newExercises": marshalledExercises,
        ":newHeadline": marshalledHeadline,
        ":newDate": marshalledDate,
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
