import { RDSDataService } from "aws-sdk";
import { buildResponse } from "./build-response";
const SqlString = require("sqlstring");

export const addUser = async (
  body: string | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!body) {
    return buildResponse(404, "Missing body");
  }

  const RDS = new RDSDataService();
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
