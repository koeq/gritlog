import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
} from "aws-lambda";

const AWS = require("aws-sdk");
const RDS = new AWS.RDSDataService();
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
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(404, "Missing query parameter");
  }

  let { userID } = queryStringParameters;
  const parsedUserID = parseInt(userID);

  // TO DO: implement a more secure way the string to avoid SQL injection
  const sql = `SELECT * FROM users WHERE userID = ${parsedUserID}`;

  try {
    const params = {
      secretArn: process.env.DBSecretsStoreArn,
      resourceArn: process.env.DBAuroraClusterArn,
      database: process.env.DatabaseName,
      sql,
    };

    return await RDS.executeStatement(params)
      .promise()
      .then((response: any) => buildResponse(200, response));
  } catch (err) {
    console.log(err);

    return buildResponse(404, err);
  }
};

const addUser = async (body: string | null) => {
  if (!body) {
    return buildResponse(404, "Missing body");
  }

  // TO DO: implement a more secure way the string to avoid SQL injection
  const sql = `INSERT INTO user (userID, email) values()`;

  try {
    return buildResponse(201, JSON.parse(body));
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
  console.log(JSON.stringify(event, null, 2));
  let response: JsonResponse;

  switch (true) {
    case event.httpMethod === "GET" && event.path === userPath:
      event.queryStringParameters;
      response = await getUser(event.queryStringParameters);
      break;

    case event.httpMethod === "POST" && event.path === userPath:
      response = await addUser(event.body);
      break;

    default:
      response = buildResponse(404, "404 not found");
  }

  console.log(event);
  return response;
};
