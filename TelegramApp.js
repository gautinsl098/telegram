"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@rocket.chat/apps-engine/definition/api");
const App_1 = require("@rocket.chat/apps-engine/definition/App");
const Settings_1 = require("./config/Settings");
const IncomingMessages_1 = require("./endpoints/IncomingMessages");
const OnSettingUpdatedHandler_1 = require("./handler/OnSettingUpdatedHandler");
const PostLivechatRoomClosedHandler_1 = require("./handler/PostLivechatRoomClosedHandler");
const PostMessageSentHandler_1 = require("./handler/PostMessageSentHandler");
const Telegram_1 = require("./lib/Telegram");
class TelegramApp extends App_1.App {
    constructor(info, logger, accessors) {
        super(info, logger, accessors);
    }
    async onEnable(environment, configurationModify) {
        const read = this.getAccessors().reader;
        const http = this.getAccessors().http;
        await Telegram_1.registerWebhook(this, read, http);
        return true;
    }
    async executePostMessageSent(message, read, http, persis, modify) {
    	console.log("test");
        try {
            const handler = new PostMessageSentHandler_1.PostMessageSentHandler(this, message, read, http, persis, modify);
            await handler.run();
        }
        catch (err) {
            this.getLogger().error(err.message);
        }
    }
    async onSettingUpdated(setting, configurationModify, read, http) {
        try {
            const onSettingUpdatedHandler = new OnSettingUpdatedHandler_1.OnSettingUpdatedHandler(this, read, setting, configurationModify, http);
            await onSettingUpdatedHandler.run();
        }
        catch (err) {
            this.getLogger().error(err.message);
        }
    }
    async executePostLivechatRoomClosed(livechatRoom, read, http, persistence) {
        try {
            const handler = new PostLivechatRoomClosedHandler_1.PostLivechatRoomClosedHandler(this, read, http, livechatRoom);
            await handler.run();
        }
        catch (err) {
            this.getLogger().error(err.message);
        }
    }
    async extendConfiguration(configuration) {
        configuration.api.provideApi({
            visibility: api_1.ApiVisibility.PUBLIC,
            security: api_1.ApiSecurity.UNSECURE,
            endpoints: [
                new IncomingMessages_1.IncomingMessages(this),
            ],
        });
        await Promise.all(Settings_1.settings.map((setting) => configuration.settings.provideSetting(setting)));
    }
}
exports.TelegramApp = TelegramApp;
