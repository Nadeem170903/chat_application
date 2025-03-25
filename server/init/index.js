const mongoose = require('mongoose')
const User = require('../models/User');
const Chat = require('../models/chat');
const Message = require('../models/message')
const sampleData = require('./SampleData');

const MONGO_URL = "mongodb://127.0.0.1:27017/ChatApp";

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));



  async function insertData(){

    try{
        await User.deleteMany();
        await Chat.deleteMany();
        await Message.deleteMany();
    } catch(er){
        console.log(er,'error inserting data');
    } finally{
        mongoose.connection.close();
    }
    
  }


  insertData();