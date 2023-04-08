import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  buildResponse,
  checkForUser,
  createUser,
  deleteAuthCookie,
  isUserAuthenticated,
  setAuthCookie,
} from "./utils";

const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];

const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

const isOriginAllowed = (
  inputOrigin: string | undefined
): string | boolean | undefined => {
  return (
    inputOrigin &&
    (DOMAIN_WHITELIST.includes(inputOrigin) ||
      LOCALHOST_REGEX.test(inputOrigin))
  );
};

const createErrorResponse = (origin: string | undefined) => {
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

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body, httpMethod, headers } = event;
    let result: APIGatewayProxyResult;
    let origin: string;

    if (isOriginAllowed(headers.origin)) {
      origin = headers.origin || "";
    } else {
      return createErrorResponse(headers.origin);
    }

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

    result = {
      ...result,
      headers: {
        ...result.headers,
        "Access-Control-Allow-Origin": origin,
      },
    };

    return result;
  } catch (error) {
    console.error(error);
    const errorResponse = buildResponse(500, error);

    return appendCorsHeaders(errorResponse, origin);
  }
};
