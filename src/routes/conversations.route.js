const express = require("express");
const conversationController = require("../controllers/conversation.controller");
const authMiddleware = require("../middlewares/authRequired");
const router = express.Router();

router.post("/", authMiddleware ,conversationController.create);

router.get("/", authMiddleware, conversationController.getUserConversation)

router.post(
    '/:id/participants',
    authMiddleware,
    conversationController.addParticipant
);

router.post(
    "/:id/messages",
    authMiddleware,
    conversationController.sendMessage
);

router.get(
    "/:id/messages",
    authMiddleware,
    conversationController.getMessages
);

module.exports = router;