import express from "express";
import {
  createGroupChat,
  getConversations,
  getConversation,
} from "../controllers/conversationControllers.js";
import { protectRoute } from "../middleware/auth.js";
import { accessChat } from "../controllers/conversationControllers.js";


const router = express.Router();

router.post("/create-group", protectRoute, createGroupChat);
router.get("/", protectRoute, getConversations);
router.get("/:id", protectRoute, getConversation);
router.post("/access", protectRoute, accessChat);


export default router;
