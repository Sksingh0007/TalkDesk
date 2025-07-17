import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/messageControllers.js";

const messageRouter = express.Router();


//Get users for sidebar except the logged in user
messageRouter.get("/users", protectRoute, getUserForSidebar)

//Get all messages from a selected user
messageRouter.get("/:id", protectRoute, getMessages);


//Sending message to receiver instantly using Socketio
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;