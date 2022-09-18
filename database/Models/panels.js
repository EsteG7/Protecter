const { Schema, model } = require("mongoose");

const panelSchema = new Schema({
    guildId: String,
    messageId: String,
    channelId: String,
    accessRoles: [String]
});

module.exports = model("panels", panelSchema);