const { Schema, model } = require("mongoose");

const backupSchema = new Schema({
    guildId: String,
    id: String,
    name: String,
    verificationLevel: String,
    explicitContentFilter: String,
    defaultMessageNotifications: String,
    widget: {
        enabled: {
            type: Boolean,
            default: null
        },
        channel: {
            type: String,
            default: null
        }
    },
    channels: {
        categories: {
            type: [Object],
            default: []
        },
        others: {
            type: [Object],
            default: []
        }
    },
    roles: {
        type: [Object],
        default: []
    },
    bans: {
        type: [Object],
        default: []
    },
    emojis: {
        type: [Object],
        default: []
    },
    createdTimestamp: Number,
    iconBase64: String,
    iconURL: String
});

module.exports = model("backups", backupSchema);