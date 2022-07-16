import { buildResponse } from "./build-response";

export const setAuthCookie = (statusCode: number, body: string | null) => {
  if (!body) {
    return buildResponse(401, "Not authorized");
  }
  const jwt = JSON.parse(body);

  const cookie = {
    "Set-Cookie": `user=${jwt}; Max-Age=${
      5 * 60
    }; Secure; HttpOnly; SameSite=none`,
  };

  return buildResponse(statusCode, "auth cookie was set", cookie);
};
