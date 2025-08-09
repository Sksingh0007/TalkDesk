import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import { io, userSocketMap } from "../server.js";

//Get all users except the logged in user

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    //Count number of message not seen
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      } else {
        unseenMessages[user._id] = 0;
      }
    });
    await Promise.all(promises);
    res.status(200).json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get conversations (both individual and group)
export const getConversationsForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Get individual users not in any conversation
    const usersInConversations = conversations
      .filter(conv => !conv.isGroup)
      .flatMap(conv => conv.participants)
      .map(user => user._id.toString())
      .filter(id => id !== userId.toString());

    const filteredUsers = await User.find({ 
      _id: { $ne: userId, $nin: usersInConversations } 
    }).select("-password");

    // Count unseen messages for each conversation
    const unseenMessages = {};
    
    for (const conversation of conversations) {
      if (conversation.isGroup) {
        const unseenCount = await Message.countDocuments({
          conversationId: conversation._id,
          senderId: { $ne: userId },
          "seenBy.user": { $ne: userId },
        });
        unseenMessages[conversation._id] = unseenCount;
      } else {
        const otherUser = conversation.participants.find(
          p => p._id.toString() !== userId.toString()
        );
        const unseenCount = await Message.countDocuments({
          senderId: otherUser._id,
          receiverId: userId,
          seen: false,
        });
        unseenMessages[otherUser._id] = unseenCount;
      }
    }

    // Count unseen messages for individual users
    for (const user of filteredUsers) {
      const unseenCount = await Message.countDocuments({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      unseenMessages[user._id] = unseenCount;
    }

    res.status(200).json({
      success: true,
      conversations,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all the messages from selected user (backward compatibility)
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: selectedUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get messages from a conversation (supports both individual and group)
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: conversationId } = req.params;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you're not a participant",
      });
    }

    const messages = await Message.find({
      conversationId: conversationId,
    }).populate("senderId", "fullName profilePic");

    // Mark messages as seen
    if (conversation.isGroup) {
      await Message.updateMany(
        {
          conversationId: conversationId,
          senderId: { $ne: userId },
          "seenBy.user": { $ne: userId },
        },
        {
          $push: {
            seenBy: {
              user: userId,
              seenAt: new Date(),
            },
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      messages,
      conversation,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Send message to a user (backward compatibility)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    let imageUrl = null;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Update or create conversation
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        isGroup: false,
        lastMessage: newMessage._id,
      });
    } else {
      conversation.lastMessage = newMessage._id;
      await conversation.save();
    }

    // Send real-time message
    const receiverSocketIds = userSocketMap[receiverId];
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", newMessage);
      });
    }

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send message to a conversation (supports both individual and group)
export const sendConversationMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: conversationId } = req.params;
    const { text, image } = req.body;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    }).populate("participants", "fullName profilePic");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or you're not a participant",
      });
    }

    let imageUrl = null;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      conversationId,
      text,
      image: imageUrl,
      seenBy: [{
        user: senderId,
        seenAt: new Date(),
      }],
    });

    // Update conversation's last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // Populate sender info
    await newMessage.populate("senderId", "fullName profilePic");

    // Send real-time message to all participants except sender
    conversation.participants.forEach((participant) => {
      if (participant._id.toString() !== senderId.toString()) {
        const participantSocketIds = userSocketMap[participant._id];
        if (participantSocketIds) {
          participantSocketIds.forEach((socketId) => {
            io.to(socketId).emit("newMessage", newMessage);
          });
        }
      }
    });

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Mark message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
