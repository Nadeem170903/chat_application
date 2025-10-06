const express = require('express');
const chatController = require('../controller/chats.controller');
const router = express.Router();
const {checkAuth} = require('../middleware/auth.middleware')

router.post('/allchat',checkAuth,chatController.findOrCreateChat);
router.post('/addmessage',chatController.addMessage);
// Delete message 
router.delete('/delete',chatController.deleteMessage)
router.get('/conversation/:chatId/:senderId/:receiverId',chatController.getConversation)



module.exports = router;