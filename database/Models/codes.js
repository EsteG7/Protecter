const { Schema, model } = require("mongoose");

const codeSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    uses: {
        type: Number,
        default: 0
    },
    endAt: {
        type: String,
        default: null
    },
    time: {
        type: String,
        default: null
    }
});

module.exports = model("codes", codeSchema);