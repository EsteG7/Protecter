const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    guildId: String,
    userId: String,
    captchaCompleted: {
        type: Boolean,
        default: false
    },
    badgeds: {
        type: [String],
        default: []
    },
    ban: {
        isBanned: {
            type: Boolean,
            default: false
        },
        endAt: {
            type: String,
            default: null
        }
    },
    mute: {
        isMuted: {
            type: Boolean,
            unique: false
        },
        endAt: {
            type: String,
            default: null
        }
    },
    warns: {
        type: Number,
        default: 0
    },
    infractions: {
        type: [Object],
        default: []
    }
});

module.exports = model("users", userSchema);