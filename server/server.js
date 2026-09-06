require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

//Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get("/", (req, res) => {
    res.json({
        message: "PromptFlow AI API is running",
    });
});

//Chat routes
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});