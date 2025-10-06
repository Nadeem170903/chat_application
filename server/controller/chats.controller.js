const Chat = require('../models/chat.modle')
const Message = require('../models/message.modle');
const mongoose = require('mongoose')




module.exports.findOrCreateChat = async (req, res) => {
    const { senderId, receiverId } = req.body;
    console.log('creact chat route',senderId,"and ",receiverId);

    try {
        // Check if a chat already exists between these two users
        let chat = await Chat.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no chat exists, create a new one
        if (!chat) {
            chat = await Chat.create({
                participants: [senderId, receiverId],
            });
            console.log('chat created',chat);
        }

        // Return the chat ID
        res.status(200).json({
          message:"chate created or open",
          chatInfo: chat
        });
    } catch (error) {
        console.error("Error finding in creating chat:", error.message);
        res.status(500).json({ error: 'sorry some technical error please try some time later' });
    }
};


// POST /api/messages
module.exports.addMessage = async (req, res) => {
    const { chatId, senderId, messageContent, receiverId, messageData } = req.body;
   

    try {
        const message = await  Message.create({
            sender: senderId,
            message: messageContent,
            receiver: receiverId,
        });

         console.log('this is messageData',message)

        

        await Chat.findByIdAndUpdate(chatId, {
            $push: { conversation: message._id },
            updatedAt: Date.now(),
        });

        // const io = req.app.get('socketio'); // Get Socket.IO instance
        // io.to(chatId).emit('receiveMessage', message); // Emit message to the chat room

        res.status(200).json({message});
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: 'Error sending message' });
    }
};

// Delete message
module.exports.deleteMessage = async(req,res)=>{
  const {senderId,chatId , messageId} = req.body;
  try{
    const message = await Message.findById(messageId);
  

    if(!message){
      return res.status(400).json({
        message:"Message Not found"
      })
    }

    // check person is authorized for deletion or not
    if(message.sender.toString() !== senderId){
      return res.status(401).json({
        message:"You are not authorized to delete this message"
      })
    }

    await Message.findByIdAndDelete(messageId);

    // update chats after delete message
    await Chat.findByIdAndUpdate(chatId,{
      $pull:{conversation:messageId},
      updatedAt:Date.now()
    });

    res.status(200).json({
      success:true,
      message:"This message is deleted"
    })
  } catch(e){
    res.status(201).json({
      success:false,
      message:"Something error here"
    })
  }

}


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