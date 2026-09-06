const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
    {
        userInput: {
            type: String,
            required: true,
        },

        promptId: {
            type: String,
            required: true,
        },

        finalPrompt: {
            type: String,
            required: true,
        },

        response: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "History",
    historySchema,
    "history"
);