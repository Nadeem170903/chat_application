


function chatSocket(io) {
    io.on('connection', (socket) => {
        console.log("connection established with this socket id", socket.id);
        socket.on('sendMessage', async (data) => {
            console.log("sender message comes properly", data);
            io.emit('recievermessage', data)
        });
        socket.on('disconnect', () => {
            console.log("Socket dis-connected", socket.id);
        });
    });
};


module.exports = chatSocket;