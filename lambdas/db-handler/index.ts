import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  JsonResponse,
  addTraining,
  buildResponse,
  deleteTraining,
  editTraining,
  getTrainings,
  isUserAuthenticated,
} from "./utils";

const trainingPath = "/training";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(JSON.stringify(event, null, 2));
    let response: JsonResponse = { body: "", headers: {}, statusCode: 0 };

    if (event.path === trainingPath) {
      console.log("we're in the training path");

      if (!isUserAuthenticated(event.headers)) {
        return buildResponse(401, "not authenticated");
      }

      const jwt = event.headers.cookie?.split("=")[1];

      switch (event.httpMethod) {
        case "GET":
          response = await getTrainings(jwt);
          break;

        case "POST":
          response = await addTraining(jwt, event);
          break;

        case "PUT":
          response = await editTraining(jwt, event);
          break;

        case "DELETE":
          response = await deleteTraining(jwt, event);
          break;

        default:
          response = buildResponse(404, "404 not found");
      }
    }

    console.log(response);
    return response;
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
