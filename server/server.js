import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
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

    if (userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(user))
    })
    
})

//middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.use("/api/status", (req, res) => res.send("Server is live"))
app.use("/api/auth", userRouter)
app.use('/api/messages', messageRouter);

//connext to mongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

