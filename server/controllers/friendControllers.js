// Unsend a friend request
export const unsendFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;
    if (!toUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient user ID required." });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Remove the request if it exists
    const before = toUser.friendRequests.length;
    toUser.friendRequests = toUser.friendRequests.filter(
      (id) => id.toString() !== fromUserId.toString()
    );
    if (toUser.friendRequests.length === before) {
      return res
        .status(400)
        .json({ success: false, message: "No pending request to unsend." });
    }
    await toUser.save();
    res.json({ success: true, message: "Friend request unsent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import User from "../models/user.js";
import { io, userSocketMap } from "../server.js";

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.body;
    if (!friendId) {
      return res
        .status(400)
        .json({ success: false, message: "Friend ID required." });
    }
    // Use atomic $pull to remove each other from friends arrays
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );
    const friend = await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    );
    if (!user || !friend) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Notify the removed friend in real time
    const friendSocketIds = userSocketMap[friendId];
    if (friendSocketIds) {
      friendSocketIds.forEach((socketId) => {
        io.to(socketId).emit("friendListChanged");
      });
    }
    res.json({ success: true, message: "Friend removed." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search users by name or email (excluding self)
export const searchUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.json({ success: true, users: [] });
    }
    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id fullName email profilePic backgroundImage username");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;
    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot send friend request to yourself.",
      });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (
      toUser.friendRequests.includes(fromUserId) ||
      toUser.friends.includes(fromUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Already sent or already friends.",
      });
    }
    toUser.friendRequests.push(fromUserId);
    await toUser.save();
    res.json({ success: true, message: "Friend request sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromUserId } = req.body;
    const user = await User.findById(userId);
    const fromUser = await User.findById(fromUserId);
    if (!user || !fromUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    if (!user.friendRequests.includes(fromUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "No such friend request." });
    }
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );
    user.friends.push(fromUserId);
    fromUser.friends.push(userId);
    await user.save();
    await fromUser.save();
    res.json({ success: true, message: "Friend request accepted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromUserId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );
    await user.save();
    res.json({ success: true, message: "Friend request rejected." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get friend requests for the logged-in user
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "friendRequests",
      "fullName profilePic email backgroundImage username"
    );
    res.json({ success: true, friendRequests: user.friendRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get friends for the logged-in user
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "friends",
      "fullName profilePic email backgroundImage username "
    );

    res.json({ success: true, friends: user.friends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sent friend requests for the logged-in user
export const getSentFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find users where their friendRequests array includes the current user
    const sentRequests = await User.find({
      friendRequests: userId,
    }).select("fullName profilePic email");
    res.json({ success: true, sentRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
