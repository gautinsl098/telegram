"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const Settings_1 = require("../config/Settings");
const Telegram_1 = require("../enum/Telegram");
const Jwt_1 = require("../helpers/Jwt");
const Settings_2 = require("./Settings");
exports.getJWT = async (read, payload) => {
    const header = exports.getJWTHeader();
    const claimSet = exports.getJWTClaimSet(payload);
    const signature = await exports.getJWTSignature(read, header, claimSet);
    return `${header}.${claimSet}.${signature}`;
};
exports.getJWTHeader = () => {
    const HEADER = {
        typ: 'JWT',
        alg: 'HS256',
    };
    return Jwt_1.base64urlEncode(JSON.stringify(HEADER));
};
exports.getJWTClaimSet = (payload) => {
    let currentUnixTime = Date.now();
    const hourInc = 1000 * 60 * 30;
    let oneHourInFuture = currentUnixTime + hourInc;
    currentUnixTime = Math.round(currentUnixTime / 1000);
    oneHourInFuture = Math.round(oneHourInFuture / 1000);
    const jwtClaimSet = {
        iat: currentUnixTime,
        nbf: currentUnixTime,
        exp: oneHourInFuture,
        aud: 'RocketChat',
        context: payload,
    };
    return Jwt_1.base64urlEncode(JSON.stringify(jwtClaimSet));
};
exports.getJWTSignature = async (read, header, claimSet) => {
    const signatureInput = `${header}.${claimSet}`;
    const JwtSecret = await Settings_2.getServerSettingValue(read, Settings_1.ServerSetting.FILE_UPLOAD_JSON_WEB_TOKEN_SECRET);
    return crypto_1.createHmac(Telegram_1.TelegramJWT.SHA256_ALGORITHM, JwtSecret)
        .update(signatureInput)
        .digest(Telegram_1.TelegramJWT.BASE64_ENCODING)
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};
