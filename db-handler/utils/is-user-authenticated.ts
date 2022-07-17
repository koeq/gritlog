import { buildResponse } from "./build-response";
import { APIGatewayProxyEventHeaders } from "aws-lambda";

export const checkAuthentication = (headers: APIGatewayProxyEventHeaders) => {
  // TO DO: CHECK
  // is it safe to only check if a cookie exists?
  if (!headers.cookie) {
    return buildResponse(401, "not authenticated");
  }

  return buildResponse(200, "authenticated");
};
