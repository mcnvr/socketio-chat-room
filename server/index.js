const express = require('express');
const app = express()
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());    

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        //seperate port for client->server interaction
        //3001 -> frontend | 3002 -> backend
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

//listening for connection
//you should only listen for events if user connects to server
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    //event to handle joining a room
    //pass room_id from frontend
    socket.on("join_room", (room_id) => {
        socket.join(room_id);
        console.log(`User with ID: ${socket.id} joined room with ID: ${room_id}`)
    });

    socket.on("send_message", (message_data) => {
        console.log(message_data);

        //socket.emit sends data to a specified socket
        //socket.to specifies the data
        socket.to(message_data.room).emit("recieve_message", message_data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconntected", socket.id);
    });

});

//3002 is port of backend
server.listen(3002, () => {
    console.log("SERVER RUNNING -> http://localhost:3002");
})