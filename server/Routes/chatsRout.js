const express = require('express');
const chatController = require('../controller/chats');
const chat = require('../models/chat');
const router = express.Router();

router.post('/api/chat',chatController.findOrCreateChat);
router.post('/api/ad',chatController.addMessage);
router.get('/api/conversation/:chatId/:senderId/:receiverId',chatController.getConversation)


module.exports = router;