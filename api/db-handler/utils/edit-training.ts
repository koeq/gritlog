import {
  AttributeValue,
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
  if (!body) {
    console.error("Unable to edit training: Missing training.");

    return buildResponse(500, "Unable to edit training.", origin);
  }

  try {
    const training = JSON.parse(body) as Training;
    const { email }: GoogleUserData = jwt_decode(jwt);
    const { exercises, headline, date, endDate } = training;

    const marshalledValues = marshall({ exercises, headline, date });
    if (
      !marshalledValues.exercises ||
      !marshalledValues.headline ||
      !marshalledValues.date
    ) {
      throw new Error("Unable to marshall training.");
    }

    let updateExpression =
      "set exercises = :newExercises, headline = :newHeadline, #date_attr = :newDate";

    const expressionAttributeValues: Record<string, AttributeValue> = {
      ":newExercises": marshalledValues.exercises,
      ":newHeadline": marshalledValues.headline,
      ":newDate": marshalledValues.date,
    };

    // Not all trainings have end dates.
    if (endDate) {
      const marshalledEndDate = marshall({ endDate }).endDate;

      if (!marshalledEndDate) {
        throw new Error("Unable to marshall end date.");
      }

      updateExpression += ", endDate = :newEndDate";
      expressionAttributeValues[":newEndDate"] = marshalledEndDate;
    }

    const params: UpdateItemCommandInput = {
      TableName: "trainings",
      Key: marshall({ email, id: training.id }),
      UpdateExpression: updateExpression,
      // Date is a reserved keyword within dynamoDB and needs to be mapped.
      ExpressionAttributeNames: {
        "#date_attr": "date",
      },
      ExpressionAttributeValues: expressionAttributeValues,
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
