import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  addTraining,
  buildResponse,
  deleteTraining,
  editTraining,
  getTrainings,
  isUserAuthenticated,
} from "./utils";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!isUserAuthenticated(event.headers)) {
      return buildResponse(401, "Not authenticated");
    }

    const {
      body,
      headers: { cookie },
      httpMethod,
      queryStringParameters,
    } = event;

    const jwt = cookie?.split("=")[1];

    switch (httpMethod) {
      case "GET":
        return await getTrainings(jwt);

      case "POST":
        return await addTraining(jwt, body);

      case "PUT":
        return await editTraining(jwt, body);

      case "DELETE":
        return await deleteTraining(jwt, queryStringParameters);

      default:
        return buildResponse(404, "404 not found");
    }
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
