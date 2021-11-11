"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVisitorMessage = async (room, message, modify) => {
    if (!message) {
        return;
    }
    const { text, attachment, visitor } = message;
    const { token } = visitor;
    const msg = modify.getCreator().startLivechatMessage()
        .setToken(token)
        .setVisitor(visitor)
        .setRoom(room);
    if (text) {
        msg.setText(text);
    }
    if (attachment) {
        msg.addAttachment(attachment);
    }
    return modify.getCreator().finish(msg);
};
exports.createAppUserMessage = async (read, modify, room, message, appId) => {
    if (!message) {
        return;
    }
    const { text, attachment } = message;
    const appUser = await read.getUserReader().getAppUser(appId);
    if (!appUser) {
        throw new Error('Error getting App user');
    }
    const msg = modify.getCreator().startLivechatMessage()
        .setSender(appUser)
        .setRoom(room);
    if (text) {
        msg.setText(text);
    }
    if (attachment) {
        msg.addAttachment(attachment);
    }
    return modify.getCreator().finish(msg);
};
