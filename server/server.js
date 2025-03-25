const { Server } = require('socket.io');
const Message = require('./models/message');
const Chat = require('./models/chat');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a chat room
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        });

        // Handle sending messages
        socket.on('sendMessage', async (data) => {
            const { chatId, senderId, messageContent, receiverId } = data;
            console.log("this is websoket data",chatId,"and",senderId," and",messageContent,"and",receiverId)

            try {
                const message = new Message({
                    sender: senderId,
                    message: messageContent.messageContent,
                    receiver: receiverId,
                });

                const savedMessage = await message.save();

                await Chat.findByIdAndUpdate(chatId, {
                    $push: { conversation: message._id },
                    updatedAt: Date.now(),
                });

                  // Populate the message details (sender and receiver)
        const populatedMessage = await Message.findById(savedMessage._id)
        .populate('sender', 'name email') // Populate sender details
        .populate('receiver', 'name email'); // Populate receiver details

    // Emit the formatted message to the chat room
    io.to(chatId).emit('receiveMessage', {
    
            
            _id: populatedMessage._id,
            message: populatedMessage.message,
            sender: populatedMessage.sender,
            receiver: populatedMessage.receiver,
            timestamp: populatedMessage.createdAt,
            chatId: chatId
      
    });
            } catch (error) {
                console.error("Error handling sendMessage:", error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = { initializeSocket };
