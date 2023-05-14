import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];
// eslint-disable-next-line security/detect-unsafe-regex
const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const origin = event.headers?.origin;

  if (!origin || !isOriginAllowed(origin)) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: `CORS validation failed: origin ${origin} not allowed`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: getHeaders(origin),
    body: JSON.stringify({
      message: "CORS validation passed: origin allowed",
    }),
  };
};

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) {
    return false;
  }

  return DOMAIN_WHITELIST.includes(origin) || LOCALHOST_REGEX.test(origin);
};

const getHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "PUT, POST, OPTIONS, GET, DELETE",
  "Access-Control-Allow-Credentials": "true",
});
