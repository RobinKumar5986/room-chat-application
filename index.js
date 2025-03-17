const { createServer } = require('node:http');
const express = require("express");
const app = express();
const server = createServer(app);
const path = require('path');
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(path.resolve("./Public")));

app.get('/', (req, res) => {
    res.sendFile(path.resolve("./Public/index.html"));
});

app.get('/room.html', (req, res) => {
    res.sendFile(path.resolve("./Public/room.html"));
});

server.listen(9000, () => {
    console.log("Server Started at 9000");
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined Room: ${roomId}`);
    });

    socket.on('user-message', ({ roomId, msg }) => {
        console.log(`Message in Room ${roomId}: ${msg}`);
        io.to(roomId).emit('broadcast-message', { msg, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});
