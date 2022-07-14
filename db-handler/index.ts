import {
  addUser,
  buildResponse,
  isUserAuthenticated,
  JsonResponse,
  getUser,
  deleteUser,
  setAuthCookie,
} from "./utils";
import { RDSDataService } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const secretArn = process.env.DBSecretsStoreArn;
const resourceArn = process.env.DBAuroraClusterArn;
const database = process.env.DatabaseName;
const userPath = "/user";
const authPath = "/auth";

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!secretArn || !resourceArn) {
    return buildResponse(500, "Missing aws arn");
  }

  const params: RDSDataService.ExecuteStatementRequest = {
    secretArn,
    resourceArn,
    database,
    sql: "",
  };

  console.log(JSON.stringify(event, null, 2));
  let response: JsonResponse = { body: "", headers: {}, statusCode: 0 };

  if (event.path === userPath) {
    switch (event.httpMethod) {
      case "GET":
        response = await getUser(event.queryStringParameters, params);
        break;

      case "POST":
        response = await addUser(event.body, params);

        break;

      case "DELETE":
        response = await deleteUser(event.queryStringParameters, params);
        break;

      default:
        response = buildResponse(404, "404 not found, user");
    }
  }

  if (event.path === authPath) {
    switch (event.httpMethod) {
      case "GET":
        response = isUserAuthenticated(event.headers);
        break;

      case "POST":
        response = setAuthCookie(event.body);
        console.log(response);
        break;

      default:
        response = buildResponse(404, "404 not found, auth");
    }
  }

  return response;
};
