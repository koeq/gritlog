import { GoogleUserData } from "./check-for-user";
import { RDSDataService } from "aws-sdk";
import { buildResponse } from "./build-response";
import jwt_decode from "jwt-decode";
import { setAuthCookie } from "./set-auth-cookie";

const SqlString = require("sqlstring");

export const createUser = async (
  body: string | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!body) {
    return buildResponse(500, "No body found");
  }

  try {
    const decoded: GoogleUserData = jwt_decode(body);
    const { email } = decoded;
    const RDS = new RDSDataService();
    const sql = SqlString.format("INSERT INTO users (email) VALUES (?)", [
      email,
    ]);

    params.sql = sql;

    const res = await RDS.executeStatement(params).promise();

    if (res.numberOfRecordsUpdated && res.numberOfRecordsUpdated > 0) {
      return setAuthCookie(201, body);
    } else {
      return buildResponse(500, "Couldn't create user");
    }
  } catch (err) {
    console.log(err);

    return buildResponse(500, err);
  }
};
