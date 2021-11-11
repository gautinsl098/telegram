"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("@rocket.chat/apps-engine/definition/settings");
var AppSetting;
(function (AppSetting) {
    AppSetting["TelegramToken"] = "telegram_token";
    AppSetting["TelegramDefaultDepartment"] = "telegram_default_department";
    AppSetting["TelegramServiceUnavailableMessage"] = "telegram_service_unavailable_message";
    AppSetting["TelegramWelcomeMessage"] = "telegram_welcome_message";
    AppSetting["TelegramConversationFinishedMessage"] = "telegram_conversation_finished_message";
    AppSetting["TelegramAgentsDisplayName"] = "telegram_agents_display_name";
    AppSetting["TelegramFileUploadEnabled"] = "Telegram_Gateway_FileUpload_Enabled";
    AppSetting["TelegramFileUploadMaxFileSizeAllowed"] = "Telegram_Gateway_FileUpload_Max_File_Size_Allowed";
    AppSetting["TelegramFileUploadMediaTypeWhiteList"] = "Telegram_Gateway_FileUpload_Media_Type_White_List";
})(AppSetting = exports.AppSetting || (exports.AppSetting = {}));
var ServerSetting;
(function (ServerSetting) {
    ServerSetting["SITE_URL"] = "Site_Url";
    ServerSetting["FILE_UPLOAD_ENABLE_JSON_WEB_TOKEN_SECRET"] = "FileUpload_Enable_json_web_token_for_files";
    ServerSetting["FILE_UPLOAD_JSON_WEB_TOKEN_SECRET"] = "FileUpload_json_web_token_secret_for_files";
    ServerSetting["FILE_UPLOAD_PROTECT_FILES"] = "FileUpload_ProtectFiles";
})(ServerSetting = exports.ServerSetting || (exports.ServerSetting = {}));
var DefaultMessage;
(function (DefaultMessage) {
    DefaultMessage["DEFAULT_TelegramServiceUnavailableMessage"] = "Sorry!! No agents are currently online";
    DefaultMessage["DEFAULT_TelegramFileUploadDisabledMessage"] = "Sorry!! This file was not shared because file sharing is disabled";
    DefaultMessage["DEFAULT_TelegramFileSizeExceedMessage"] = "Sorry!! This file was not shared because file size was too large";
    DefaultMessage["DEFAULT_TelegramFileInvalidExtensionMessage"] = "Sorry!! This file was not shared because files with this type of extension is not allowed";
})(DefaultMessage = exports.DefaultMessage || (exports.DefaultMessage = {}));
var AgentsDisplayNameOptions;
(function (AgentsDisplayNameOptions) {
    AgentsDisplayNameOptions["NONE"] = "None";
    AgentsDisplayNameOptions["NAME"] = "Name";
    AgentsDisplayNameOptions["USERNAME"] = "Username";
})(AgentsDisplayNameOptions = exports.AgentsDisplayNameOptions || (exports.AgentsDisplayNameOptions = {}));
exports.settings = [
    {
        id: AppSetting.TelegramToken,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: '',
        i18nLabel: 'telegram_bot_token',
        required: true,
    },
    {
        id: AppSetting.TelegramDefaultDepartment,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: '',
        i18nLabel: 'telegram_default_department',
        i18nDescription: 'telegram_default_department_description',
        required: true,
    },
    {
        id: AppSetting.TelegramServiceUnavailableMessage,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: '',
        i18nLabel: 'telegram_service_unavailable_message',
        i18nDescription: 'telegram_service_unavailable_message_description',
        required: true,
    },
    {
        id: AppSetting.TelegramWelcomeMessage,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: '',
        i18nLabel: 'telegram_welcome_message',
        i18nDescription: 'telegram_welcome_message_description',
        required: true,
    },
    {
        id: AppSetting.TelegramConversationFinishedMessage,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: '',
        i18nLabel: 'telegram_conversation_finished_message',
        required: true,
    },
    {
        id: AppSetting.TelegramAgentsDisplayName,
        public: true,
        type: settings_1.SettingType.SELECT,
        packageValue: AgentsDisplayNameOptions.NONE,
        value: AgentsDisplayNameOptions.NONE,
        values: [
            {
                key: AgentsDisplayNameOptions.NONE,
                i18nLabel: 'None',
            },
            {
                key: AgentsDisplayNameOptions.NAME,
                i18nLabel: 'Name',
            },
            {
                key: AgentsDisplayNameOptions.USERNAME,
                i18nLabel: 'Username',
            },
        ],
        i18nLabel: 'telegram_agents_display_name',
        i18nDescription: 'telegram_agents_display_name_description',
        required: true,
    },
    {
        id: AppSetting.TelegramFileUploadEnabled,
        public: true,
        type: settings_1.SettingType.BOOLEAN,
        packageValue: true,
        value: true,
        i18nLabel: 'telegram_file_upload_enabled_message',
        required: true,
    },
    {
        id: AppSetting.TelegramFileUploadMaxFileSizeAllowed,
        public: true,
        type: settings_1.SettingType.NUMBER,
        packageValue: 104857600,
        i18nLabel: 'telegram_file_upload_max_size_message',
        i18nDescription: 'telegram_file_upload_max_size_message_description',
        required: true,
    },
    {
        id: AppSetting.TelegramFileUploadMediaTypeWhiteList,
        public: true,
        type: settings_1.SettingType.STRING,
        packageValue: 'image/*,application/pdf',
        i18nLabel: 'telegram_media_type_whitelist_message',
        i18nDescription: 'telegram_media_type_whitelist_message_description',
        required: true,
    },
];
