"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../config/Settings");
const Settings_2 = require("../lib/Settings");
const Telegram_1 = require("../lib/Telegram");
class PostLivechatRoomClosedHandler {
    constructor(app, read, http, livechatRoom) {
        this.app = app;
        this.read = read;
        this.http = http;
        this.livechatRoom = livechatRoom;
    }
    async run() {
        const { closedAt, visitor, customFields: { telegramChannel = null } = {} } = this.livechatRoom;
        if (!telegramChannel) {
            return;
        }
        const { session_id } = telegramChannel;
        if (!closedAt || !visitor || !session_id) {
            return;
        }
        const conversationFinishedMessage = await Settings_2.getAppSettingValue(this.read, Settings_1.AppSetting.TelegramConversationFinishedMessage);
        if (!conversationFinishedMessage || conversationFinishedMessage === '') {
            return;
        }
        await Telegram_1.sendAgentMessage(this.http, this.read, conversationFinishedMessage, telegramChannel);
    }
}
exports.PostLivechatRoomClosedHandler = PostLivechatRoomClosedHandler;
