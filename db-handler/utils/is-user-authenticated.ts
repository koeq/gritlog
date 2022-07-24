import { APIGatewayProxyEventHeaders } from "aws-lambda";

export const isUserAuthenticated = (headers: APIGatewayProxyEventHeaders) => {
  // TO DO: CHECK
  // is it safe to only check if a cookie exists?
  if (!headers.cookie) {
    return false;
  }

  return true;
};
