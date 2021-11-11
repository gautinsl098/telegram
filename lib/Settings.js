"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppSettingValue = async (read, id) => {
    return id && await read.getEnvironmentReader().getSettings().getValueById(id);
};
exports.getServerSettingValue = async (read, id) => {
    return id && await read.getEnvironmentReader().getServerSettings().getValueById(id);
};
