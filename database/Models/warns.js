const { Schema, model } = require("mongoose");

const warnSchema = new Schema({
    guildId: String,
    userId: String,
    warnId: Number,
    reason: {
        type: String,
        default: null
    },
    endAt: {
        type: String,
        default: null
    },
    staff: String
});

module.exports = model("warns", warnSchema);