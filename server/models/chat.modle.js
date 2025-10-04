// chats schema
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',  // reference to User collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  conversation: [
   { type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
   }
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
