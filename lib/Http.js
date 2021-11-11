"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpRequest = (headers, data) => {
    return {
        headers,
        data,
    };
};
exports.createHttpResponse = (status, headers, payload) => {
    return {
        status,
        headers,
        content: payload,
    };
};
