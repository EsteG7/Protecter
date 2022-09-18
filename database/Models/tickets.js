const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
    guildId: String,
    userId: String,
    panelId: String,
    channelId: String
});

module.exports = model("tickets", ticketSchema);