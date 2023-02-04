import { JsonResponse, buildResponse } from "./build-response";

export const deleteAuthCookie = (statusCode: number): JsonResponse => {
  try {
    const cookie = {
      "Set-Cookie": `user=''; Max-Age=${0}; Secure; HttpOnly; SameSite=none`,
    };

    return buildResponse(statusCode, "Auth cookie was deleted", cookie);
  } catch (err) {
    return buildResponse(500, "Couldn't delete auth cookie");
  }
};
