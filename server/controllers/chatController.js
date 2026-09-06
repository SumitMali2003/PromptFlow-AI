const Prompt = require("../models/Prompt");
const History = require("../models/History");
const { generateResponse } = require("../services/aiService");

const processSingleInput = async(userInput) => {

    // 1. Fetch prompt from MongoDB
    const promptDocument = await Prompt.findById("Education_Prompt");

    if(!promptDocument){
    throw new Error("Education prompt not found in database");
    }

    // 2. Replace {{userInput}} with actual user input
    const finalPrompt = promptDocument.template.replace(
    "{{userInput}}",
    userInput
    );

    // 3. Send final prompt to OpenAI
    const response = await generateResponse(finalPrompt);

    // 4. Save request and response in history
    await History.create({
        userInput,
        promptId: promptDocument._id,
        finalPrompt,
        response,
    });

    // 5. Return AI response
    return response;
};

const chat = async (req, res) => {
    try{
        const { userInput } = req.body;

        //validate input
        if(!userInput || typeof userInput !== "string"){
            return res.status(400).json({
                message: "userInput is required and must be a string",
            });
        }

        const response = await processSingleInput(userInput);

        return res.status(200).json({
            response,
        });
    }
    catch (error) {
        console.error("Chat error:", error.message);

        return res.status(500).json({
            message: "Failed to process request",
            error: error.message,
        });
    }
};

const batchChat = async (req, res) => {
    try {
        const { userInputs } = req.body;

        //validate input
        if(!Array.isArray(userInputs)) {
            return res.status(400).json({
                message: "userInputs must be an array",
            });
        }

        if(userInputs.length === 0){
            return res.status(400).json({
                message: "userInputs cannot be empty",
            });
        }

        if(userInputs.some((input) => typeof input !== "string" || !input.trim())){
            return res.status(400).json({
                message: "Every userInput must be a non-empty string",
            });
        }
        //Process all inputs asynchronously 
        const responses = await Promise.all(
            userInputs.map((input) => processSingleInput(input))
        );

        return res.status(200).json({
            responses,
        });
    }
    catch(error) {
        console.error("Batch chat error:", error.message);

        return res.status(500).json({
            message: "Failed to process batch request",
            error: error.message,
        });
    }
};

module.exports = {
    chat,
    batchChat,
};