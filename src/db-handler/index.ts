export {};
const AWS = require("aws-sdk");
const RDS = new AWS.RDSDataService();

const userPath = "/user";

exports.handler = async (event: any) => {
  // Log the entire event passed in
  console.log(JSON.stringify(event, null, 2));

  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === userPath:
      response = await getUser(event.queryStringParameters.userId);
      break;
    case event.httpMethod === "POST" && event.path === userPath:
      console.log(event.body);
      response = await addUser(JSON.parse(event.body));
      break;

    default:
      response = buildResponse(404, "404 not found");
  }

  return response;
};

const getUser = async (id: number) => {
  // TODO: implement a more secure way the string to avoid SQL injection
  const sql = `SELECT * FROM users WHERE userID = ${id}`;

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

const addUser = async (body: any) => {
  return buildResponse(200, body);
};

const buildResponse = (statusCode: number, body: any) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
};
