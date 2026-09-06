const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },

        template: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Prompt", promptSchema, "prompts");