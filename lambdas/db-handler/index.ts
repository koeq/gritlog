import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  addTraining,
  buildResponse,
  deleteTraining,
  editTraining,
  getTrainings,
  isUserAuthenticated,
} from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const isAuthenticated = isUserAuthenticated(event.headers);
    if (!isAuthenticated) {
      return buildResponse(401, "Not authenticated");
    }

    const {
      body,
      headers: { cookie },
      httpMethod,
      queryStringParameters,
    } = event;

    const jwt = cookie?.split("=")[1];
    let result: APIGatewayProxyResult;

    switch (httpMethod) {
      case "GET":
        result = await getTrainings(jwt);
        break;
      case "POST":
        result = await addTraining(jwt, body);
        break;
      case "PUT":
        result = await editTraining(jwt, body);
        break;
      case "DELETE":
        result = await deleteTraining(jwt, queryStringParameters);
        break;
      default:
        result = buildResponse(404, "404 not found");
    }

    return result;
  } catch (error) {
    console.error(error);

    return buildResponse(500, error);
  }
};
