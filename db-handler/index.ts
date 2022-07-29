import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  buildResponse,
  checkForUser,
  createUser,
  deleteUser,
  getUser,
  JsonResponse,
  setAuthCookie,
} from "./utils";
import { isUserAuthenticated } from "./utils/is-user-authenticated";
import { getAllTrainings } from "./utils/get-all-trainings";

const authPath = "/auth";
const userPath = "/user";
const trainingPath = "/training";

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
            console.log("we already have an user an set the cookie");
            response = setAuthCookie(200, event.body);
          } else {
            console.log("we created an user and set the cookie");
            response = await createUser(event.body);
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
          response = await getUser(event.queryStringParameters);
          break;

        case "DELETE":
          console.log("we're in the DELETE method");
          response = await deleteUser(event.queryStringParameters);
          break;

        default:
          response = buildResponse(404, "404 not found");
      }
    }

    if (event.path === trainingPath) {
      console.log("we're in the training path");

      if (!isUserAuthenticated(event.headers)) {
        return buildResponse(403, "not authenticated");
      }

      const jwt = event.headers.cookie?.split("=")[1];

      switch (event.httpMethod) {
        case "GET":
          response = await getAllTrainings(jwt);
          break;

        case "POST":
          break;

        case "PUT":
          break;

        case "DELETE":
          break;

        default:
          response = buildResponse(404, "404 not found");
      }
    }

    return response;
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
