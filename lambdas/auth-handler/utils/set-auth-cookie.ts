import { APIGatewayProxyEvent } from "aws-lambda";
import { JsonResponse, buildResponse } from "../../utils";

export const setAuthCookie = (
  statusCode: number,
  body: APIGatewayProxyEvent["body"],
  origin: string | undefined
): JsonResponse => {
  try {
    if (!body) {
      return buildResponse(500, "No body found", origin);
    }

    const jwt = JSON.parse(body);

    // TODO: CHECK
    // Is SameSite=none safe?
    const cookie = {
      "Set-Cookie": `user=${jwt}; Max-Age=${604800}; Secure; HttpOnly; SameSite=none`,
    };

    return buildResponse(statusCode, "Auth cookie was set.", origin, cookie);
  } catch (err) {
    return buildResponse(500, "Unable to set auth cookie.", origin);
  }
};
