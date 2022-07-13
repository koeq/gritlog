import { buildResponse } from "./build-response";

export const setAuthCookie = (body: string | null) => {
  if (!body) {
    return buildResponse(404, "no body");
  }
  const jwt = JSON.parse(body);

  const cookie = {
    "Set-Cookie": `user=${jwt}; Max-Age=${
      5 * 60
    }; Secure; HttpOnly; SameSite=none`,
  };

  return buildResponse(200, "cookie was set", cookie);
};
