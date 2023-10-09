import { APIGatewayProxyEventHeaders } from "aws-lambda";

export const isUserAuthenticated = (
  headers: APIGatewayProxyEventHeaders
): boolean => {
  // TODO: check for cookie key not just if a cookie exists
  if (!headers.cookie) {
    return false;
  }

  return true;
};
