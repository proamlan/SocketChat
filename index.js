const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

// Store connected clients
let clients = [];

io.on("connection", (socket) => {
  // Add client to the list
  clients.push(socket);

  socket.on("disconnect", () => {
    // Remove client from the list
    clients = clients.filter((client) => client !== socket);
  });

  socket.on("message", (message) => {
    console.log("Received: ", message);

    // Broadcast message to all clients except sender
    clients.forEach((client) => {
      if (client !== socket) {
        client.emit("message", message);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
