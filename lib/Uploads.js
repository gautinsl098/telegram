"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../config/Settings");
const Logs_1 = require("../enum/Logs");
const Telegram_1 = require("../enum/Telegram");
const Livechat_1 = require("../helpers/Livechat");
const Settings_2 = require("./Settings");
const Telegram_2 = require("./Telegram");
exports.createVisitorUpload = async (read, modify, http, room, fileUpload, telegramChannel) => {
    const { audio, document, video, photo, voice } = fileUpload;
    let upload = audio || video || document || voice;
    if (photo) {
        const maxResolutionPhoto = photo.reduce((prev, current) => (prev.file_size > current.file_size) ? prev : current);
        maxResolutionPhoto.mime_type = Telegram_1.Telegram.IMAGE_DEFAULT_MIME_TYPE;
        upload = maxResolutionPhoto;
    }
    if (!upload) {
        return;
    }
    const { file_id, file_name, file_size, mime_type } = upload;
    const { visitor: { token } } = room;
    try {
        await Livechat_1.validateUploadFile(read, { file_size, mime_type });
    }
    catch (error) {
        await Telegram_2.sendAgentMessage(http, read, error.message, telegramChannel);
        return;
    }
    const telegramToken = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramToken);
    if (!telegramToken) {
        throw new Error(Logs_1.Logs.SETTING_TOKEN_NOT_DEFINED);
    }
    const fileUrl = await Telegram_2.resolveFileInfo(http, telegramToken, file_id);
    if (!fileUrl) {
        throw new Error(Logs_1.Logs.ERROR_GETTING_FILE_URL);
    }
    const { content: buffer } = await http.get(fileUrl, { encoding: null });
    if (!buffer) {
        throw new Error(Logs_1.Logs.ERROR_DOWNLOADING_FILE);
    }
    const payload = {
        room,
        filename: file_name ? file_name : Telegram_2.extractFilenameFromUrl(fileUrl),
        visitorToken: token,
    };
    const uploadedFile = await modify.getCreator().getUploadCreator().uploadBuffer(buffer, payload);
    if (!uploadedFile) {
        throw new Error(Logs_1.Logs.ERROR_WHILE_UPLOADING_FILE);
    }
};
