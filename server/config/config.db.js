const mongoose = require('mongoose');
// MongoDB Connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/ChatApp";




  const connectDB = async ()=>{
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database connected succesfully")
    } catch (error) {

        console.error("MongoDB connection failed",error.message);
        process.exit(1);
        
    }
  }


  module.exports = connectDB;