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

interface JsonResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
  };
  body: string;
}

const getUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(500, "Missing query parameter");
  }

  const { userID } = queryStringParameters;
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

// const addUser = async (
//   body: string | null,
//   params: RDSDataService.ExecuteStatementRequest
// ) => {
//   if (!body) {
//     return buildResponse(404, "Missing body");
//   }

//   const { userID, email }: { userID: string; email: string } = JSON.parse(body);
//   const sql = SqlString.format(
//     "INSERT INTO users (userID, email) VALUES (?,?)",
//     [userID, email]
//   );

//   params.sql = sql;

//   try {
//     return await RDS.executeStatement(params)
//       .promise()
//       .then((response) => buildResponse(201, "Created user"));
//   } catch (err) {
//     console.log(err);

//     return buildResponse(404, err);
//   }
// };

const deleteUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(500, "Missing query parameter");
  }

  const { userID } = queryStringParameters;
  const sql = SqlString.format("DELETE FROM users WHERE userID = ?", [userID]);
  params.sql = sql;

  try {
    return await RDS.executeStatement(params)
      .promise()
      .then(() => buildResponse(200, "Deleted User"));
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
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

const buildResponse = (statusCode: number, body: any): JsonResponse => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(body),
  };
};

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
