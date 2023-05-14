import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  addTraining,
  buildResponse,
  deleteTraining,
  editTraining,
  getTrainings,
  isUserAuthenticated,
} from "./utils";

const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];
// eslint-disable-next-line security/detect-unsafe-regex
const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { body, httpMethod, headers, queryStringParameters } = event;
  const origin = headers.origin;

  if (origin === undefined || !isOriginAllowed(origin)) {
    return createCorsErrorResponse(origin);
  }

  try {
    const isAuthenticated = isUserAuthenticated(headers);
    if (!isAuthenticated) {
      const errorResponse = buildResponse(401, "Not authenticated");

      return appendCorsHeaders(errorResponse, origin);
    }

    const { cookie } = headers;
    const jwt = cookie?.split("=")[1];
    let result: APIGatewayProxyResult;

    switch (httpMethod) {
      case "GET":
        result = await getTrainings(jwt);
        break;
      case "POST":
        result = await addTraining(jwt, body);
        break;
      case "PUT":
        result = await editTraining(jwt, body);
        break;
      case "DELETE":
        result = await deleteTraining(jwt, queryStringParameters);
        break;
      default:
        result = buildResponse(404, "404 not found");
    }

    return appendCorsHeaders(result, origin);
  } catch (error) {
    console.error(error);
    const errorResponse = buildResponse(500, error);

    return appendCorsHeaders(errorResponse, origin);
  }
};

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (origin === undefined) {
    return false;
  }

  return DOMAIN_WHITELIST.includes(origin) || LOCALHOST_REGEX.test(origin);
};

const createCorsErrorResponse = (origin: string | undefined) => {
  return {
    statusCode: 403,
    body: JSON.stringify({
      message: `CORS validation failed: origin ${origin} not allowed`,
    }),
  };
};

const appendCorsHeaders = (
  result: APIGatewayProxyResult,
  origin: string
): APIGatewayProxyResult => {
  return {
    ...result,
    headers: {
      ...result.headers,
      "Access-Control-Allow-Origin": origin,
    },
  };
};
