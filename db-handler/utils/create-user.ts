import { RDSDataService } from "aws-sdk";
import { buildResponse } from "./build-response";
import jwt_decode from "jwt-decode";
import { setAuthCookie } from "./set-auth-cookie";
const SqlString = require("sqlstring");

interface GoogleUserData {
  iss: string;
  nbf: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: string;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

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

export const checkForUser = async (
  body: string | null,
  params: RDSDataService.ExecuteStatementRequest
) => {
  if (!body) {
    return false;
  }

  try {
    const decoded: GoogleUserData = jwt_decode(body);
    const { email } = decoded;
    const RDS = new RDSDataService();
    const sql = SqlString.format("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    params.sql = sql;

    const res = await RDS.executeStatement(params).promise();

    return res?.records?.length === 0 ? false : true;
  } catch (err) {
    console.log(err);

    return false;
  }
};
