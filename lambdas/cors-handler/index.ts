import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];

const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

const isOriginAllowed = (inputOrigin: string | undefined): boolean => {
  return (
    !!inputOrigin &&
    (DOMAIN_WHITELIST.includes(inputOrigin) ||
      LOCALHOST_REGEX.test(inputOrigin))
  );
};

const getHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "PUT, POST, OPTIONS, GET, DELETE",
  "Access-Control-Allow-Credentials": "true",
});

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const DEFAULT_ORIGIN = "https://gritlog.app";

  let corsOrigin = DEFAULT_ORIGIN; // default value
  const origin = event.headers?.origin;

  if (origin && isOriginAllowed(origin)) {
    corsOrigin = origin;
  } else {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: `CORS validation failed: origin ${origin} not allowed`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: getHeaders(corsOrigin),
    body: JSON.stringify({
      message: "CORS validation passed: origin allowed",
    }),
  };
};
