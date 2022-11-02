import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  JsonResponse,
  buildResponse,
  checkForUser,
  createUser,
  deleteAuthCookie,
  isUserAuthenticated,
  setAuthCookie,
} from "./utils";

const authPath = "/auth";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(JSON.stringify(event, null, 2));
    console.log("hello from auth lambda");
    let response: JsonResponse = { body: "", headers: {}, statusCode: 0 };

    if (event.path === authPath) {
      console.log("We're in the auth path.");

      switch (event.httpMethod) {
        case "GET":
          if (isUserAuthenticated(event.headers)) {
            response = buildResponse(200, "authenticated");
          } else {
            response = buildResponse(401, "not authenticated");
          }
          break;

        case "POST": {
          console.log("We're in the POST method.");
          const user = await checkForUser(event.body);

          if (user) {
            response = setAuthCookie(200, event);
            console.log("We already have a user. We set the cookie.");
          } else {
            response = await createUser(event);
            console.log("we created an user and set the cookie");
          }
          break;
        }

        case "DELETE": {
          console.log("We're in the DELETE method.");
          response = deleteAuthCookie(200);

          break;
        }

        default:
          console.log("we're in default");
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
