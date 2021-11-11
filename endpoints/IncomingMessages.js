"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessors_1 = require("@rocket.chat/apps-engine/definition/accessors");
const api_1 = require("@rocket.chat/apps-engine/definition/api");
const Settings_1 = require("../config/Settings");
const Http_1 = require("../enum/Http");
const Logs_1 = require("../enum/Logs");
const Livechat_1 = require("../helpers/Livechat");
const Http_2 = require("../lib/Http");
const Messages_1 = require("../lib/Messages");
const Settings_2 = require("../lib/Settings");
const Telegram_1 = require("../lib/Telegram");
const Uploads_1 = require("../lib/Uploads");
class IncomingMessages extends api_1.ApiEndpoint {
    constructor() {
        super(...arguments);
        this.path = 'incoming-messages';
    }
    async post(request, endpoint, read, modify, http, persis) {
    	console.log("Inside incoming message");
        try {
            await this.processRequest(read, modify, http, request.content);
            return Http_2.createHttpResponse(accessors_1.HttpStatusCode.OK, { 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON }, { result: Http_1.Response.SUCCESS });
        }
        catch (error) {
            this.app.getLogger().error(Logs_1.Logs.ENDPOINT_REQUEST_PROCESSING_ERROR, error);
            return Http_2.createHttpResponse(accessors_1.HttpStatusCode.INTERNAL_SERVER_ERROR, { 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON }, { error: error.message });
        }
    }
    async processRequest(read, modify, http, endpointContent) {
        const { message, message: { from: { id: userId, first_name, last_name }, text, photo, video, audio, document, voice } } = endpointContent;
        if (!userId) {
            throw new Error(Logs_1.Logs.INVALID_USER_ID);
        }
        const telegramChannel = {
            session_id: String(userId),
            first_name,
            last_name,
        };
        const departmentIdOrName = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramDefaultDepartment);
        let department;
        if (departmentIdOrName) {
            const departmentDB = await Livechat_1.defineDepartment(read, departmentIdOrName);
            department = departmentDB && departmentDB.id;
        }
        const serviceOnline = await read.getLivechatReader().isOnlineAsync(department);
        if (!serviceOnline) {
            const offlineServiceMessage = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramServiceUnavailableMessage);
            const responseMessage = offlineServiceMessage || Settings_1.DefaultMessage.DEFAULT_TelegramServiceUnavailableMessage;
            await Telegram_1.sendAgentMessage(http, read, responseMessage, telegramChannel);
            return;
        }
        const visitor = await Livechat_1.defineVisitor(read, modify, { userId, first_name, last_name, department });
        const room = await Livechat_1.defineRoom(read, modify, this.app.getID(), visitor, { telegramChannel });
        const welcomeMessage = await Livechat_1.defineRoomWelcomeMessage(room, read);
        if (welcomeMessage && welcomeMessage !== '') {
            await Telegram_1.sendAgentMessage(http, read, welcomeMessage, telegramChannel);
        }
        if (text) {
            await Messages_1.createVisitorMessage(room, { text, visitor }, modify);
        }
        if (photo || audio || video || document || voice) {
            await Uploads_1.createVisitorUpload(read, modify, http, room, message, telegramChannel);
        }
    }
}
exports.IncomingMessages = IncomingMessages;
