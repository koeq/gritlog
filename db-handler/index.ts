import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  addTraining,
  buildResponse,
  checkForUser,
  createUser,
  deleteUser,
  editTraining,
  getUser,
  JsonResponse,
  setAuthCookie,
  isUserAuthenticated,
  getTrainings,
  deleteTraining,
} from "./utils";

const authPath = "/auth";
const userPath = "/user";
const trainingPath = "/training";
const healthPath = "/health";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(JSON.stringify(event, null, 2));
    let response: JsonResponse = { body: "", headers: {}, statusCode: 0 };

    if (event.path === authPath) {
      console.log("we're in the auth path");

      switch (event.httpMethod) {
        case "GET":
          if (isUserAuthenticated(event.headers)) {
            response = buildResponse(200, "authenticated");
          } else {
            response = buildResponse(401, "not authenticated");
          }
          break;

        case "POST":
          console.log("we're in POST method");
          const user = await checkForUser(event.body);

          if (user) {
            response = setAuthCookie(200, event);
            console.log("we already have an user an set the cookie");
          } else {
            response = await createUser(event);
            console.log("we created an user and set the cookie");
          }
          break;

        default:
          console.log("we're in default");
          response = buildResponse(404, "404 not found");
      }
    }

    if (event.path === userPath) {
      console.log("we're in the user path");

      if (!isUserAuthenticated(event.headers)) {
        return buildResponse(403, "not authenticated");
      }

      switch (event.httpMethod) {
        case "GET":
          console.log("we're in the GET method");
          response = await getUser(event);
          break;

        case "DELETE":
          console.log("we're in the DELETE method");
          response = await deleteUser(event);
          break;

        case "OPTIONS":
          response = buildResponse(200, "");
          break;

        default:
          response = buildResponse(404, "404 not found");
      }
    }

    if (event.path === trainingPath) {
      console.log("we're in the training path");

      if (!isUserAuthenticated(event.headers)) {
        buildResponse(403, "not authenticated");
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

    if (event.path === healthPath) {
      response = buildResponse(200, "OK");
    }

    console.log(response);
    return response;
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
