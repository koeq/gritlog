import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { RDSDataService } from "aws-sdk";
import { buildResponse } from "./build-response";
const SqlString = require("sqlstring");

export const deleteUser = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!queryStringParameters || !queryStringParameters.userID) {
    return buildResponse(500, "Missing query parameter");
  }

  const RDS = new RDSDataService();
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
