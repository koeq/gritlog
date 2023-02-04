import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  buildResponse,
  checkForUser,
  createUser,
  deleteAuthCookie,
  isUserAuthenticated,
  setAuthCookie,
} from "./utils";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body, httpMethod, headers } = event;

    switch (httpMethod) {
      case "GET":
        if (isUserAuthenticated(headers)) {
          return buildResponse(200, "Authenticated");
        } else {
          return buildResponse(401, "Not authenticated");
        }

      case "POST": {
        const user = await checkForUser(body);

        if (user) {
          return setAuthCookie(200, body);
        } else {
          return await createUser(body);
        }
      }

      case "DELETE": {
        return deleteAuthCookie(200);
      }

      default:
        return buildResponse(404, "404 not found");
    }
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
