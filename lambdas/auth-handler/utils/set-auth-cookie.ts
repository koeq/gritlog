import { APIGatewayProxyEvent } from "aws-lambda";
import { JsonResponse, buildResponse } from "./build-response";

export const setAuthCookie = (
  statusCode: number,
  body: APIGatewayProxyEvent["body"]
): JsonResponse => {
  try {
    if (!body) {
      return buildResponse(500, "No body found");
    }

    const jwt = JSON.parse(body);

    // TODO: CHECK
    // Is SameSite=none safe?
    const cookie = {
      "Set-Cookie": `user=${jwt}; Max-Age=${604800}; Secure; HttpOnly; SameSite=none`,
    };

    return buildResponse(statusCode, "Auth cookie was set", cookie);
  } catch (err) {
    return buildResponse(500, "Couldn't set auth cookie");
  }
};
