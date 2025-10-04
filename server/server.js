require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./App');
const chatSocket = require('./socket/chat.socket');
const connectDB = require('./config/config.db');

// call connectDB 
connectDB();



const port = process.env.PORT || 4000;
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});


// sockect connect create 
chatSocket(io);

// sever listen 
server.listen(port, () => console.log(`chat application server start at port ${port}`));

