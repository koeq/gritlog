import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  addTraining,
  deleteTraining,
  editTraining,
  getTrainings,
  isUserAuthenticated,
} from "./utils";
import { buildResponse } from "../utils";

const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];
// eslint-disable-next-line security/detect-unsafe-regex
const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { body, httpMethod, headers, queryStringParameters } = event;
  const origin = headers.origin;

  try {
    if (!isOriginAllowed(origin)) {
      return buildResponse(
        403,
        "CORS validation failed: origin not allowed.",
        origin
      );
    }

    const isAuthenticated = isUserAuthenticated(headers);

    if (!isAuthenticated) {
      return buildResponse(401, "Not authenticated.", origin);
    }

    const { cookie } = headers;
    const jwt = cookie?.split("=")[1];

    if (!jwt) {
      console.error("Missing JWT token.");

      return buildResponse(500, "Unable to perform trainings action.", origin);
    }

    let result: APIGatewayProxyResult;

    switch (httpMethod) {
      case "GET":
        result = await getTrainings(jwt, origin);
        break;
      case "POST":
        result = await addTraining(jwt, body, origin);
        break;
      case "PUT":
        result = await editTraining(jwt, body, origin);
        break;
      case "DELETE":
        result = await deleteTraining(jwt, queryStringParameters, origin);
        break;
      default:
        result = buildResponse(404, "404: Not found.", origin);
    }

    return result;
  } catch (error) {
    console.error(error);

    return buildResponse(500, error, origin);
  }
};

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (origin === undefined) {
    return false;
  }

  return DOMAIN_WHITELIST.includes(origin) || LOCALHOST_REGEX.test(origin);
};
