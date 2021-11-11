"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const users_1 = require("@rocket.chat/apps-engine/definition/users");
const Livechat_1 = require("../helpers/Livechat");
const ShortNameToUnicode_1 = require("../lib/Emoji/ShortNameToUnicode");
const Telegram_1 = require("../lib/Telegram");
class PostMessageSentHandler {
    constructor(app, message, read, http, persis, modify) {
        this.app = app;
        this.message = message;
        this.read = read;
        this.http = http;
        this.persis = persis;
        this.modify = modify;
    }
    async run() {
        const { text, editedAt, room, token, file, sender: { type: senderType } } = this.message;
        const livechatRoom = room;
        const { type, isOpen, servedBy, customFields: { telegramChannel = null } = {} } = livechatRoom;
        if (!telegramChannel) {
            return;
        }
        if (!type || type !== rooms_1.RoomType.LIVE_CHAT) {
            return;
        }
        if (!isOpen || token || editedAt || !servedBy || senderType === users_1.UserType.APP) {
            return;
        }
        if (text && text.trim().length !== 0) {
            const agentsDisplayName = await Livechat_1.defineAgentName(this.read, servedBy);
            const message = `${agentsDisplayName}${ShortNameToUnicode_1.shortNameToUnicode(text)}`;
            await Telegram_1.sendAgentMessage(this.http, this.read, message, telegramChannel);
        }
        if (file) {
            await Telegram_1.sendAgentFile(this.http, this.read, this.modify, this.app.getID(), this.message, telegramChannel);
        }
    }
}
exports.PostMessageSentHandler = PostMessageSentHandler;
