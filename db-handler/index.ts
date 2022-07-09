import { RDSDataService } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildResponse, JsonResponse } from "./utils/build-response";
import { getUser } from "./utils/get-user";
import { deleteUser } from "./utils/delete-user";

const secretArn = process.env.DBSecretsStoreArn;
const resourceArn = process.env.DBAuroraClusterArn;
const database = process.env.DatabaseName;
const userPath = "/user";

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
  let response: JsonResponse;

  switch (true) {
    case event.httpMethod === "GET" && event.path === userPath:
      response = await getUser(event.queryStringParameters, params);
      break;

    case event.httpMethod === "POST" && event.path === userPath:
      response = await returnUser(event.body);
      // response = await addUser(event.body, params);

      break;

    case event.httpMethod === "DELETE" && event.path === userPath:
      response = await deleteUser(event.queryStringParameters, params);
      break;

    default:
      response = buildResponse(404, "404 not found");
  }

  return response;
};

const returnUser = async (body: string | null) => {
  if (!body) {
    return buildResponse(500, "Missing body");
  }
  const userData = await verifyJwtToken(JSON.parse(body));
  return buildResponse(200, userData);
};

const verifyJwtToken = async (jsonWebToken: string | null) => {
  if (!jsonWebToken) {
    return;
  }

  return jsonWebToken;
};
