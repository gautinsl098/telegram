"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../config/Settings");
const Telegram_1 = require("../lib/Telegram");
class OnSettingUpdatedHandler {
    constructor(app, read, setting, configurationModify, http) {
        this.app = app;
        this.read = read;
        this.setting = setting;
        this.configurationModify = configurationModify;
        this.http = http;
    }
    async run() {
        const { id, value } = this.setting;
        if (id !== Settings_1.AppSetting.TelegramToken || !value) {
            return;
        }
        await Telegram_1.registerWebhook(this.app, this.read, this.http);
    }
}
exports.OnSettingUpdatedHandler = OnSettingUpdatedHandler;
