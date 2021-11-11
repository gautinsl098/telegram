"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../config/Settings");
const Logs_1 = require("../enum/Logs");
const Settings_2 = require("../lib/Settings");
exports.registerVisitor = async (read, modify, data) => {
    const visitorId = await modify.getCreator().getLivechatCreator().createVisitor(data);
    const visitor = await read.getLivechatReader().getLivechatVisitorById(visitorId);
    if (!visitor) {
        throw new Error(Logs_1.Logs.VISITOR_REGISTER_ERROR);
    }
    return visitor;
};
exports.defineVisitor = async (read, modify, { userId, first_name, last_name, department }) => {
    let visitor = await read.getLivechatReader().getLivechatVisitorByPhoneNumber(String(userId));
    if (!visitor) {
        const visitorData = Object.assign({ token: modify.getCreator().getLivechatCreator().createToken(), username: `telegram:${userId}`, name: `${first_name} ${last_name}`, phone: [{ phoneNumber: String(userId) }] }, department && { department });
        visitor = await exports.registerVisitor(read, modify, visitorData);
    }
    const { department: visitorDepartment } = visitor;
    if (department && department !== visitorDepartment) {
        visitor = Object.assign(visitor, { department });
        return exports.registerVisitor(read, modify, visitor);
    }
    return visitor;
};
exports.defineRoom = async (read, modify, appId, visitor, extraData) => {
    let [room] = await read.getLivechatReader().getLivechatRooms(visitor);
    if (!room) {
        room = await modify.getCreator().getLivechatCreator().createRoom(visitor, {});
        if (Object.keys(extraData).length > 0) {
            const { id: rid } = room;
            const sender = await read.getUserReader().getAppUser(appId);
            if (!sender) {
                throw new Error(Logs_1.Logs.ERROR_GETTING_APP_ID);
            }
            const roomBuilder = await modify.getUpdater().room(rid, sender);
            const customFields = Object.assign({}, extraData);
            roomBuilder.setCustomFields(customFields);
            await modify.getUpdater().finish(roomBuilder);
        }
    }
    return room;
};
exports.defineDepartment = async (read, idOrName) => {
    if (!idOrName || idOrName === '') {
        return;
    }
    const department = await read.getLivechatReader().getLivechatDepartmentByIdOrName(idOrName);
    if (!department || !department.enabled || department.numberOfAgents === 0) {
        throw new Error(Logs_1.Logs.SETTING_INVALID_DEPARTMENT_NAME);
    }
    return department;
};
exports.defineRoomWelcomeMessage = async (room, read) => {
    if (room && room.messageCount && room.messageCount > 0) {
        return;
    }
    return await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramWelcomeMessage);
};
exports.validateUploadFile = async (read, { file_size, mime_type }) => {
    const { value: fileUploadEnabled } = await read.getEnvironmentReader().getSettings().getById(Settings_1.AppSetting.TelegramFileUploadEnabled);
    const fileUploadMaxFileSizeAllowed = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramFileUploadMaxFileSizeAllowed);
    if (!fileUploadEnabled) {
        throw new Error(Settings_1.DefaultMessage.DEFAULT_TelegramFileUploadDisabledMessage);
    }
    else if (fileUploadMaxFileSizeAllowed > -1 && file_size > fileUploadMaxFileSizeAllowed) {
        throw new Error(Settings_1.DefaultMessage.DEFAULT_TelegramFileSizeExceedMessage);
    }
    else if (mime_type && !(await exports.fileUploadIsValidContentType(read, mime_type, Settings_1.AppSetting.TelegramFileUploadMediaTypeWhiteList))) {
        throw new Error(Settings_1.DefaultMessage.DEFAULT_TelegramFileInvalidExtensionMessage);
    }
    return true;
};
exports.fileUploadIsValidContentType = async (read, type, whiteListSetting) => {
    const list = await exports.fileUploadMediaWhiteList(read, whiteListSetting);
    if (!list) {
        return true;
    }
    if (!type) {
        return false;
    }
    if (list.includes(type)) {
        return true;
    }
    const wildCardGlob = '/*';
    const wildcards = list.filter((item) => item.indexOf(wildCardGlob) > 0);
    if (wildcards.includes(type.replace(/(\/.*)$/, wildCardGlob))) {
        return true;
    }
    return false;
};
exports.fileUploadMediaWhiteList = async (read, whiteListSetting) => {
    const mediaTypeWhiteList = await Settings_2.getAppSettingValue(read, whiteListSetting);
    if (!mediaTypeWhiteList || mediaTypeWhiteList === '*') {
        return;
    }
    return mediaTypeWhiteList.split(',').map((item) => item.trim());
};
exports.defineAgentName = async (read, agent) => {
    const agentsDisplayName = await Settings_2.getAppSettingValue(read, Settings_1.AppSetting.TelegramAgentsDisplayName);
    switch (agentsDisplayName) {
        case Settings_1.AgentsDisplayNameOptions.NAME:
            const { name } = agent;
            return `[${name}] - `;
        case Settings_1.AgentsDisplayNameOptions.USERNAME:
            const { username } = agent;
            return `[${username}] - `;
        default:
            return '';
    }
};
