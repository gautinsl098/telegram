"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../config/Settings");
const Http_1 = require("../enum/Http");
const Logs_1 = require("../enum/Logs");
const Telegram_1 = require("../enum/Telegram");
const Livechat_1 = require("../helpers/Livechat");
const Http_2 = require("./Http");
const Jwt_1 = require("./Jwt");
const Messages_1 = require("./Messages");
const Settings_2 = require("./Settings");
exports.sendAgentMessage = async (http, read, text, telegramChannelInfo) => {
    const token = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramToken);
    if (!token) {
        throw new Error(Logs_1.Logs.SETTING_TOKEN_NOT_DEFINED);
    }

    const url = `${Telegram_1.Telegram.API_URL_PREFIX}${token}/sendMessage`;
    
    console.log("Message: ");
    console.log(text);
    let httpRequestContent;
    // [Telegram buttons: [handover], [callback], [jira]] I did not find anything in Knowledge base...
    console.log(text.includes("Telegram buttons:") === true);
    if(text.includes("Telegram buttons:") === true){
    	console.log("Here");
        let regExp = /\(([^)]+)\)/;
        let buttons = regExp.exec(text)[1].split(",");
        let realText = text.split("$")[1];
        console.log(buttons);
        console.log(realText);
        let keyboard = [];
        let keyboardArray = [];
        for(let i = 0; i < buttons.length; i++){
            keyboardArray.push({
                text: buttons[i],
            });
        }
        keyboard.push(keyboardArray);
        let keyboardMarkup = {"keyboard": keyboard, "one_time_keyboard": true};
        console.log(keyboardMarkup);
        httpRequestContent = Http_2.createHttpRequest({ 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON, 'Accept': Http_1.Headers.ACCEPT_JSON }, {
            chat_id: telegramChannelInfo.session_id,
            text: realText,
            reply_markup: JSON.stringify(keyboardMarkup),
        });
    }
    else{
    	console.log("Here 1");
    	
        httpRequestContent = Http_2.createHttpRequest({ 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON, 'Accept': Http_1.Headers.ACCEPT_JSON }, {
            chat_id: telegramChannelInfo.session_id,
            text,
        });
    }

   console.log("https payload: ");
   console.log(httpRequestContent);
    const { data } = await http.post(url, httpRequestContent);
    const { ok } = data;
    console.log(ok);
    if (!ok) {
        throw new Error(`${Logs_1.Logs.ERROR_SENDING_MESSAGE}${JSON.stringify(data)}`);
    }
};
exports.sendAgentFile = async (http, read, modify, appId, message, telegramChannelInfo) => {
    const { room, room: { id: rid }, file, file: { _id: fileId = null } = {}, sender: { id: userId } } = message;
    if (!file || !fileId) {
        return;
    }
    const upload = await read.getUploadReader().getById(fileId);
    if (!upload) {
        throw new Error(Logs_1.Logs.ERROR_FILE_ID_INVALID);
    }
    const { type, url, size } = upload;
    try {
        await Livechat_1.validateUploadFile(read, { file_size: size, mime_type: type });
    }
    catch (error) {
        await Messages_1.createAppUserMessage(read, modify, room, { text: error.message }, appId);
        return;
    }
    const { value: protectFileSettingEnabled } = await read.getEnvironmentReader().getServerSettings().getOneById(Settings_1.ServerSetting.FILE_UPLOAD_PROTECT_FILES);
    const { value: JWTShareEnabled } = await read.getEnvironmentReader().getServerSettings().getOneById(Settings_1.ServerSetting.FILE_UPLOAD_ENABLE_JSON_WEB_TOKEN_SECRET);
    const telegramToken = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramToken);
    let API_URL = '';
    let variableHttpPayload = null;
    let FILE_URL = url;
    if (protectFileSettingEnabled) {
        if (!JWTShareEnabled) {
            await Messages_1.createAppUserMessage(read, modify, room, { text: Settings_1.DefaultMessage.DEFAULT_TelegramFileUploadDisabledMessage }, appId);
            return;
        }
        const jwt = await Jwt_1.getJWT(read, { rid, userId, fileId });
        FILE_URL = `${FILE_URL}?token=${jwt}`;
    }
    if (type === 'image/gif') {
        API_URL = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/sendAnimation`;
        variableHttpPayload = { animation: FILE_URL };
    }
    else if (type.startsWith('image')) {
        API_URL = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/sendPhoto`;
        variableHttpPayload = { photo: FILE_URL };
    }
    else if (type.startsWith('video')) {
        API_URL = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/sendVideo`;
        variableHttpPayload = { video: FILE_URL };
    }
    else if (type.startsWith('audio')) {
        API_URL = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/sendAudio`;
        variableHttpPayload = { audio: FILE_URL };
    }
    else if (type.startsWith('application')) {
        API_URL = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/sendDocument`;
        variableHttpPayload = { document: FILE_URL };
    }
    await exports.sendAgentFileHelper(http, API_URL, variableHttpPayload, telegramChannelInfo);
};
exports.sendAgentFileHelper = async (http, url, variableHttpPayload, telegramChannelInfo) => {
    if (!url || (url && url.length === 0) || !variableHttpPayload) {
        throw new Error(Logs_1.Logs.INVALID_FILE_URL_OR_PAYLOAD);
    }
    const httpRequestContent = Http_2.createHttpRequest({ 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON, 'Accept': Http_1.Headers.ACCEPT_JSON }, Object.assign({ chat_id: telegramChannelInfo.session_id }, variableHttpPayload));
    const { data } = await http.post(url, httpRequestContent);
    const { ok } = data;
    if (!ok) {
        throw new Error(`${Logs_1.Logs.ERROR_WHILE_SENDING_FILE}${data}`);
    }
};
exports.registerWebhook = async (app, read, http) => {
    const telegramToken = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramToken);
    if (!telegramToken) {
        return;
    }
    await exports.deleteWebhook(http, telegramToken);
    const apiUrl = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/setWebhook`;
    const [endpoint] = app.getAccessors().providedApiEndpoints;
    const serverUrl = await Settings_2.getServerSettingValue(read, Settings_1.ServerSetting.SITE_URL);
    const { computedPath } = endpoint;
    const webHookEndpoint = `${serverUrl}${computedPath}`;
    const httpRequestContent = Http_2.createHttpRequest({ 'Content-Type': Http_1.Headers.CONTENT_TYPE_JSON, 'Accept': Http_1.Headers.ACCEPT_JSON }, {
        url: webHookEndpoint,
        allowed_updates: ['message', 'channel_post'],
    });
    const { data } = await http.post(apiUrl, httpRequestContent);
    const { ok, result, description } = data;
    if (!ok || !result) {
        throw new Error(`${Logs_1.Logs.ERROR_REGISTERING_WEBHOOK}${description}`);
    }
};
exports.deleteWebhook = async (http, telegramToken) => {
    const url = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/deleteWebhook`;
    const { data } = await http.get(url);
    if (!data) {
        throw new Error(Logs_1.Logs.ERROR_DELETING_WEBHOOK_INVALID_RESPONSE);
    }
    const { ok, result, description } = data;
    if (!ok || !result) {
        throw new Error(`${Logs_1.Logs.ERROR_DELETING_WEBHOOK}${description}`);
    }
};
exports.resolveFileInfo = async (http, telegramToken, fileId) => {
    if (!fileId || !telegramToken) {
        return;
    }
    const url = `${Telegram_1.Telegram.API_URL_PREFIX}${telegramToken}/getFile?file_id=${fileId}`;
    const { data } = await http.get(url);
    if (!data) {
        throw new Error(Logs_1.Logs.ERROR_GETTING_FILE_INFO);
    }
    const { ok, result: { file_path = null } = {}, description } = data;
    if (!ok || !file_path) {
        throw new Error(`${Logs_1.Logs.ERROR_GETTING_FILE_INFO}${description}`);
    }
    return `https://api.telegram.org/file/bot${telegramToken}/${file_path}`;
};
exports.extractFilenameFromUrl = (url) => {
    const splitUrl = url.split('/');
    if (splitUrl.length === 0) {
        throw new Error(`${Logs_1.Logs.ERROR_EXTRACTING_FILE_NAME} ${url}`);
    }
    return splitUrl[splitUrl.length - 1];
};
