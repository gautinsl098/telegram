"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telegram;
(function (Telegram) {
    Telegram["API_URL_PREFIX"] = "https://api.telegram.org/bot";
    Telegram["IMAGE_DEFAULT_MIME_TYPE"] = "image/jpg";
})(Telegram = exports.Telegram || (exports.Telegram = {}));
var Base64;
(function (Base64) {
    Base64["BASE64_DICTIONARY"] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    Base64["BASE64_PAD"] = "=";
})(Base64 = exports.Base64 || (exports.Base64 = {}));
var TelegramJWT;
(function (TelegramJWT) {
    TelegramJWT["BASE64_ENCODING"] = "base64";
    TelegramJWT["SHA256_ALGORITHM"] = "sha256";
})(TelegramJWT = exports.TelegramJWT || (exports.TelegramJWT = {}));
