import { RDSDataService } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
} from "aws-lambda";
const SqlString = require("sqlstring");

const RDS = new RDSDataService();
const secretArn = process.env.DBSecretsStoreArn;
const resourceArn = process.env.DBAuroraClusterArn;
const database = process.env.DatabaseName;
const userPath = "/user";
const trainingPath = "/training";
const exercisePath = "/exercise";

interface JsonResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
  };
  body: string;
}

const getUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(404, "Missing query parameter");
  }

  let { userID } = queryStringParameters;

  const sql = SqlString.format("SELECT * FROM users WHERE userID = ?", [
    userID,
  ]);
  params.sql = sql;

  try {
    return await RDS.executeStatement(params)
      .promise()
      .then((response) => buildResponse(200, response));
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};

const addUser = async (
  body: string | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!body) {
    return buildResponse(404, "Missing body");
  }

  const { userID, email }: { userID: string; email: string } = JSON.parse(body);
  const sql = SqlString.format(
    "INSERT INTO users (userID, email) VALUES (?,?)",
    [userID, email]
  );

  params.sql = sql;

  try {
    return await RDS.executeStatement(params)
      .promise()
      .then((response) => buildResponse(201, "Created user"));
  } catch (err) {
    console.log(err);

    return buildResponse(404, err);
  }
};

const buildResponse = (statusCode: number, body: any): JsonResponse => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};

exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(secretArn, resourceArn);
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
      event.queryStringParameters;
      response = await getUser(event.queryStringParameters, params);
      break;

    case event.httpMethod === "POST" && event.path === userPath:
      response = await addUser(event.body, params);
      break;

    default:
      response = buildResponse(404, "404 not found");
  }

  return response;
};