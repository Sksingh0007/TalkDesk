import express from "express"
import { protectRoute } from "../middleware/auth";
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageControllers";

const messageRouter = express.Router();


//Get users for sidebar except the logged in user
messageRouter.get("/users", protectRoute, getUserForSidebar)

//Get all messages from a selected user
messageRouter.get("/:id", protectRoute, getMessages);

//Mark message as seen message id
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)

//Sending message to receiver instantly using Socketio
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;