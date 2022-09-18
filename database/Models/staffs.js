const { Schema, model } = require("mongoose");

const staffSchema = new Schema({
    userId: String
});

module.exports = model("staffs", staffSchema);