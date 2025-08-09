import express from "express";
import {
  createGroupChat,
  getConversations,
  getConversation,
  updateGroupInfo,
  addGroupMember,
  removeGroupMember,
} from "../controllers/conversationControllers.js";
import { protectRoute } from "../middleware/auth.js";
import { accessChat } from "../controllers/conversationControllers.js";


const router = express.Router();

router.post("/create-group", protectRoute, createGroupChat);
router.get("/", protectRoute, getConversations);
router.get("/:id", protectRoute, getConversation);
router.put("/:id", protectRoute, updateGroupInfo);
router.post("/:id/add-member", protectRoute, addGroupMember);
router.post("/:id/remove-member", protectRoute, removeGroupMember);
router.post("/access", protectRoute, accessChat);


export default router;
