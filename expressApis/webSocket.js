const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userSocket = new Map();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.listen(4000, () => console.log("Server started at 4000"));

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("register", (userId) => {
    userSocket.set(userId, socket.id);
    console.log(`${userId} -> ${userSocket.get(userId)}`);
    io.emit("usersOnline", Array.from(userSocket.keys()));
  });

  socket.emit("usersOnline", Array.from(userSocket.keys()));

  socket.on("joinRoom", ({ rId, uId1, uId2 }) => {
    socket.join(rId);

    const otherUserSocket = userSocket.get(`${uId2}`);
    if (!otherUserSocket) {
      socket.emit("notification", `User ${uId2} Offline`);
    } else {
      io.to(otherUserSocket).emit(
        "notification",
        `User ${uId1} wants to connect`
      );
    }
  });

  socket.on("msg", (data) => {
    const roomId = data.roomId;
    socket.to(roomId).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (let [userId, socketId] of userSocket.entries()) {
      if (socketId === socket.id) {
        userSocket.delete(userId);
        break;
      }
    }
    io.emit("usersOnline", Array.from(userSocket.keys()));
  });
});
