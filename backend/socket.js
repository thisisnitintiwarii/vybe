import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// changing single direction server to bidirectional server

const io = new Server(server, {
  cors: {
    origin: "https://vybe-gzu3.onrender.com",
    methods: ["GET", "POST"],
  },
});
const useSocketMap = {}; //userId:socketId

export const getSocketId = (reciverId) =>{
  return useSocketMap[reciverId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != undefined) {
    useSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(useSocketMap));

  socket.on("disconnect", () => {
    delete useSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(useSocketMap));
  });
});

export { app, io, server };
