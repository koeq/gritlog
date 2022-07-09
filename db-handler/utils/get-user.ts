import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { RDSDataService } from "aws-sdk";
import { buildResponse } from "./build-response";
const SqlString = require("sqlstring");

export const getUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(500, "Missing query parameter");
  }
  
  const RDS = new RDSDataService();
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
