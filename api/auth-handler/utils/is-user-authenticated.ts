import { APIGatewayProxyEventHeaders } from "aws-lambda";

export const isUserAuthenticated = (
  headers: APIGatewayProxyEventHeaders
): boolean => {
  if (!headers.cookie) {
    return false;
  }

  return true;
};
