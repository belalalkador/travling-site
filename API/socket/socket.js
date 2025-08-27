import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';

export const app = express();
export const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let userSocketMap = {};

export const getSocketId = (id) => {
  return userSocketMap[id];
};


io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log(userId)
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 Mapped user ${userId} -> ${socket.id}`);
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`🔴 User ${userId} disconnected`);
    }
  });
});


