import { JsonResponse, buildResponse } from "../../utils";

export const deleteAuthCookie = (
  statusCode: number,
  origin: string | undefined
): JsonResponse => {
  try {
    const cookie = {
      "Set-Cookie": `user=''; Max-Age=${0}; Secure; HttpOnly; SameSite=none`,
    };

    return buildResponse(
      statusCode,
      "Auth cookie was deleted.",
      origin,
      cookie
    );
  } catch (err) {
    return buildResponse(500, "Unable to delete auth cookie.", origin);
  }
};
