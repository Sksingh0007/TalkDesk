import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  searchUsers,
  getSentFriendRequests,
  removeFriend,
  unsendFriendRequest,
} from "../controllers/friendControllers.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();
router.post("/unsend", protectRoute, unsendFriendRequest);

router.post("/send", protectRoute, sendFriendRequest);
router.post("/accept", protectRoute, acceptFriendRequest);
router.post("/reject", protectRoute, rejectFriendRequest);
router.post("/remove", protectRoute, removeFriend);
router.get("/requests", protectRoute, getFriendRequests);
router.get("/list", protectRoute, getFriends);
router.get("/search", protectRoute, searchUsers);
router.get("/sent", protectRoute, getSentFriendRequests);

export default router;
