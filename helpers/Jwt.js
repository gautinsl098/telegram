"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Telegram_1 = require("../enum/Telegram");
exports.base64urlEncode = (str) => {
    const utf8str = unescape(encodeURIComponent(str));
    return exports.base64EncodeData(utf8str, utf8str.length, Telegram_1.Base64.BASE64_DICTIONARY, Telegram_1.Base64.BASE64_PAD);
};
exports.base64EncodeData = (data, len, b64x, b64pad) => {
    let dst = '';
    let i;
    for (i = 0; i <= len - 3; i += 3) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2);
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
        dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2) | (data.charCodeAt(i + 2) >>> 6));
        dst += b64x.charAt(data.charCodeAt(i + 2) & 63);
    }
    if (len % 3 === 2) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2);
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4) | (data.charCodeAt(i + 1) >>> 4));
        dst += b64x.charAt(((data.charCodeAt(i + 1) & 15) << 2));
        dst += b64pad;
    }
    else if (len % 3 === 1) {
        dst += b64x.charAt(data.charCodeAt(i) >>> 2);
        dst += b64x.charAt(((data.charCodeAt(i) & 3) << 4));
        dst += b64pad;
        dst += b64pad;
    }
    return dst;
};
