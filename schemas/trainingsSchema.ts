import { JSONSchema6 } from "json-schema";

export const trainingsSchema: JSONSchema6 = {
  type: "object",
  patternProperties: {
    // training ids
    "^[0-9]+$": {
      type: "object",
      properties: {
        date: {
          type: "string",
        },
        exercises: {
          type: ["array"],
          items: {
            type: "object",
            properties: {
              exerciseName: {
                type: ["string", "null"],
              },
              weight: {
                type: ["string", "null"],
              },
              repetitions: {
                type: ["string", "null"],
              },
            },
          },
        },
      },
    },
  },
  minProperties: 1,
};
