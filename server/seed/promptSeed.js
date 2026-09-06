require("dotenv").config();

const connectDB = require("../config/db");
const Prompt = require("../models/Prompt");

const seedPrompt = async () => {
    try{
        await connectDB();
        
        await Prompt.findByIdAndUpdate(
            "Education_Prompt",
            {
                _id: "Education_Prompt",
                template: "You are an expert in education. Answer the following question clearly and briefly. Keep the answer under 100 words and use simple language.\n\nQuestion: {{userInput}}",
            },
            {
                upsert: true,
                new: true,
            }
        );

        console.log("Education prompt added successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

seedPrompt();