import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import { Server } from "socket.io";
import { log } from "console";


//create express and http server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})
//Store online users
export const userSocketMap = {}; // {userid : socket id}

//Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  // On connection
  if (userId) {
    if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
    userSocketMap[userId].add(socket.id);
  }

  const getOnlineUsers = () =>
    Object.keys(userSocketMap).filter((id) => userSocketMap[id].size > 0);

  io.emit("getOnlineUsers", getOnlineUsers());

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      // Log the disconnect event
        console.log(`User disconnected: ${userId} (socket: ${socket.id})`);
        
        if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", getOnlineUsers());
  });
})

//middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.use("/api/status", (req, res) => res.send("Server is live"))
app.use("/api/auth", userRouter)
app.use('/api/messages', messageRouter);
app.use('/api/conversations', conversationRouter);

//connext to mongoDB
await connectDB();

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

//exporting server for vercel
export default server;


