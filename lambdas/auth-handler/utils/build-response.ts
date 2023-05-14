export interface JsonResponse {
  statusCode: number;
  headers?: {
    "Content-Type"?: string;
    "Access-Control-Allow-Origin"?: string;
    "Access-Control-Allow-Methods"?: string;
    "Access-Control-Allow-Headers"?: string;
    "Access-Control-Allow-Credentials"?: string;
    "Set-Cookie"?: string;
  };
  body: string;
}

export const buildResponse = (
  statusCode: number,
  body: unknown,
  origin: string | undefined,
  cookie?: {
    "Set-Cookie": string;
  }
): JsonResponse => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
      "Access-Control-Allow-Credentials": "true",
      ...cookie,
    },
    body: JSON.stringify(body),
  };
};
