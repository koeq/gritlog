import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, isOriginAllowed } from "../utils";
import {
  checkForUser,
  createUser,
  deleteAuthCookie,
  isUserAuthenticated,
  setAuthCookie,
} from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { body, httpMethod, headers } = event;
  const origin = headers.origin;
  let result: APIGatewayProxyResult = { statusCode: 200, body: "" };

  try {
    if (!isOriginAllowed(origin)) {
      return buildResponse(
        403,
        "CORS validation failed: origin not allowed.",
        origin
      );
    }

    switch (httpMethod) {
      case "GET":
        result = isUserAuthenticated(headers)
          ? buildResponse(200, "Authenticated.", origin)
          : buildResponse(401, "Not authenticated.", origin);

        break;

      case "POST": {
        const user = await checkForUser(body);

        result = user
          ? setAuthCookie(200, body, origin)
          : await createUser(body, origin);

        break;
      }

      case "DELETE": {
        result = deleteAuthCookie(200, origin);

        break;
      }

      default:
        result = buildResponse(404, "404: Not found.", origin);
    }

    return result;
  } catch (error) {
    console.error(error);

    return buildResponse(500, "Internal server error.", origin);
  }
};
