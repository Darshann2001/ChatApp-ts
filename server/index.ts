// server/index.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import type { ChatMessage } from "../shared/c-types";  // no ".js"

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("chatMessage", (msg: ChatMessage) => {
    console.log(`💬 ${msg.user}: ${msg.text}`);
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
