const { Schema, model } = require("mongoose");

const blacklistSchema = new Schema({
    userId: String,
    endAt: {
        type: String,
        default: null
    },
    reason: {
        type: String,
        default: "Actividad maliciosa"
    },
    photos: {
        type: [String],
        default: []
    }
});

module.exports = model("blacklist", blacklistSchema);