const express = require("express");

const { chat, batchChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/", chat);

router.post("/batch", batchChat);

module.exports = router;