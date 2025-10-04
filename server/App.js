const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Attach routes
const authRout = require('./Routes/auth.routes');
const chatRout = require('./Routes/chats.routes');
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser())


// test api 

app.get('/',(req,res)=>{
  console.log('request come properly');
  res.send("api working")
})



// routes call
app.use('/api/auth', authRout);
app.use('/api/chat', chatRout);



module.exports = app