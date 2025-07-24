import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { 
  getMessages, 
  getUserForSidebar, 
  sendMessage,
  getConversationsForSidebar,
  getConversationMessages,
  sendConversationMessage,
  markMessageAsSeen
} from "../controllers/messageControllers.js";

const messageRouter = express.Router();

//Get users for sidebar except the logged in user (backward compatibility)
messageRouter.get("/users", protectRoute, getUserForSidebar)

//Get conversations and users for sidebar (new endpoint for group support)
messageRouter.get("/conversations", protectRoute, getConversationsForSidebar)

//Get all messages from a selected user (backward compatibility)
messageRouter.get("/:id", protectRoute, getMessages);

//Get messages from a conversation (supports groups)
messageRouter.get("/conversation/:id", protectRoute, getConversationMessages);

//Sending message to receiver instantly using Socketio (backward compatibility)
messageRouter.post("/send/:id", protectRoute, sendMessage)

//Send message to a conversation (supports groups)
messageRouter.post("/conversation/:id", protectRoute, sendConversationMessage)

//Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)

export default messageRouter;