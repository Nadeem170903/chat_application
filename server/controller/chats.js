const Chat = require('../models/chat')
const Message = require('../models/message');
const mongoose = require('mongoose')




module.exports.findOrCreateChat = async (req, res) => {
    const { userId1, userId2 } = req.body;
    console.log('creact chat route',userId1,"and ",userId2);

    try {
        // Check if a chat already exists between these two users
        let chat = await Chat.findOne({
            participants: { $all: [userId1, userId2] },
        });

        // If no chat exists, create a new one
        if (!chat) {
            
            chat = new Chat({
                participants: [userId1, userId2],
            });
            console.log('chat created');
            await chat.save();
        }

        // Return the chat ID
        res.status(200).json({ chatId: chat._id });
    } catch (error) {
        console.error("Error finding or creating chat:", error);
        res.status(500).json({ error: 'Error finding or creating chat' });
    }
};


// POST /api/messages
module.exports.addMessage = async (req, res) => {
    const { chatId, senderId, messageContent, receiverId, messageData } = req.body;
    console.log('this is messageData',)

    try {
        const message = new Message({
            sender: senderId,
            message: messageContent,
            receiver: receiverId,
        });

        await message.save();

        await Chat.findByIdAndUpdate(chatId, {
            $push: { conversation: message._id },
            updatedAt: Date.now(),
        });

        const io = req.app.get('socketio'); // Get Socket.IO instance
        io.to(chatId).emit('receiveMessage', message); // Emit message to the chat room

        res.status(200).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: 'Error sending message' });
    }
};


// GET /api/messages

module.exports.getConversation = async (req, res) => {
    const { chatId, senderId, receiverId } = req.params;
  
    try {
      // Ensure that IDs are in the correct ObjectId format
      const chatObjectId = new mongoose.Types.ObjectId(chatId);
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
  
      const chat = await Chat.findById(chatObjectId).populate({
        path: 'conversation', // Populate the conversation field
        match: {              // Only include messages between senderId and receiverId
          $or: [
            { sender: senderObjectId, receiver: receiverObjectId },
            { sender: receiverObjectId, receiver: senderObjectId },
          ],
        },
        populate: {           // Further populate sender and receiver details within each message
          path: 'sender receiver', // Assuming `receiver` is also stored in Message schema
          select: 'name email',    // Select specific fields if needed
        },
      });
  
      // If no chat is found
      if (!chat) {
        return res.json({ message: 'No conversation found between these users' });
      }
  
      // Log the conversation to verify
      console.log('Conversation:', chat.conversation);
  
      // Return the populated conversation
      res.json(chat.conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: 'Error fetching conversation' });
    }
  };