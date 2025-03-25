const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User')
const http = require('http');
const { initializeSocket } = require('./server'); // Import socket setup

// MongoDB Connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/ChatApp";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

  app.post('/api/alluser',async(req,res)=>{
    const user = await User.find();
    res.json(user);
    });

// Attach routes
const UserRout = require('./Routes/userRout');
const chatRout = require('./Routes/chatsRout');
app.use('/', UserRout);
app.use('/', chatRout);

// Initialize Socket.IO
const io = initializeSocket(server);
app.set('socketio', io); // Attach to the app for use in controllers

// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
