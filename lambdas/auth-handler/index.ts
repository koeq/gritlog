import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  buildResponse,
  checkForUser,
  createUser,
  deleteAuthCookie,
  isUserAuthenticated,
  setAuthCookie,
} from "./utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body, httpMethod, headers } = event;
    let result: APIGatewayProxyResult;

    switch (httpMethod) {
      case "GET":
        result = isUserAuthenticated(headers)
          ? buildResponse(200, "Authenticated")
          : buildResponse(401, "Not authenticated");
        break;

      case "POST": {
        const user = await checkForUser(body);
        result = user ? setAuthCookie(200, body) : await createUser(body);
        break;
      }

      case "DELETE": {
        result = deleteAuthCookie(200);
        break;
      }

      default:
        result = buildResponse(404, "404 not found");
    }

    return result;
  } catch (error) {
    console.error(error);

    return buildResponse(500, error);
  }
};
