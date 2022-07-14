import { buildResponse } from "./build-response";
import { APIGatewayProxyEventHeaders } from "aws-lambda";

export const isUserAuthenticated = (headers: APIGatewayProxyEventHeaders) => {
  return buildResponse(200, headers);
};
