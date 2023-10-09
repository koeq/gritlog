import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt_decode from "jwt-decode";
import { JsonResponse, Training, buildResponse } from "../../utils";
import { GoogleUserData } from "./check-for-user";
import { ddbClient } from "./ddb-client";

export const editTraining = async (
  jwt: string,
  body: APIGatewayProxyEvent["body"],
  origin: string | undefined
): Promise<JsonResponse> => {
  try {
    if (!body) {
      console.error("Unable to edit training: Missing training.");

      return buildResponse(500, "Unable to edit training.", origin);
    }

    const training = JSON.parse(body) as Training;
    const { email }: GoogleUserData = jwt_decode(jwt);

    const marshalledExercises = marshall({ exercises: training.exercises })[
      "exercises"
    ];

    if (!marshalledExercises) {
      throw new Error("Unable to marshall exercises");
    }

    const marshalledHeadline = marshall({ headline: training.headline })[
      "headline"
    ];

    if (!marshalledHeadline) {
      throw new Error("Unable to marshall headline");
    }

    const marshalledDate = marshall({ date: training.date })["date"];

    if (!marshalledDate) {
      throw new Error("Unable to marshall date");
    }

    const params: UpdateItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id: training.id }),
      UpdateExpression:
        "set exercises = :newExercises, headline = :newHeadline, #date_attr = :newDate",
      // Date is a reserved keyword within dynamoDB and needs to be mapped
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

    return buildResponse(200, "Training was edited.", origin);
  } catch (err) {
    console.log(err);

    return buildResponse(500, "Unable to edit training.", origin);
  }
};
