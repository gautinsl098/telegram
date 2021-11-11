"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ascii_1 = require("./ascii");
const emojis_1 = require("./emojis");
const shortnamePattern = new RegExp(/:[-+_a-z0-9]+:/, 'gi');
const replaceShortNameWithUnicode = (shortname) => emojis_1.emojis[shortname] || shortname;
const regAscii = new RegExp(`((\\s|^)${ascii_1.asciiRegexp}(?=\\s|$|[!,.?]))`, 'gi');
const unescapeHTML = (str) => {
    const unescaped = {
        '&amp;': '&',
        '&#38;': '&',
        '&#x26;': '&',
        '&lt;': '<',
        '&#60;': '<',
        '&#x3C;': '<',
        '&gt;': '>',
        '&#62;': '>',
        '&#x3E;': '>',
        '&quot;': '"',
        '&#34;': '"',
        '&#x22;': '"',
        '&apos;': '\'',
        '&#39;': '\'',
        '&#x27;': '\'',
    };
    return str.replace(/&(?:amp|#38|#x26|lt|#60|#x3C|gt|#62|#x3E|apos|#39|#x27|quot|#34|#x22);/ig, (match) => unescaped[match]);
};
exports.shortNameToUnicode = (str) => {
    str = str.replace(shortnamePattern, replaceShortNameWithUnicode);
    str = str.replace(regAscii, (entire, m1, m2, m3) => {
        if (!m3 || !(unescapeHTML(m3) in ascii_1.ascii)) {
            return entire;
        }
        m3 = unescapeHTML(m3);
        return ascii_1.ascii[m3];
    });
    return str;
};
