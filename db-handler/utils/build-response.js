"use strict";
exports.__esModule = true;
exports.buildResponse = void 0;
var buildResponse = function (statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify(body)
    };
};
exports.buildResponse = buildResponse;
