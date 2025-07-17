import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";
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

//Get all the messages from selected user

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
    res.json({
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

// api to mark message as seen using message id is handled in the getUsers itself

//Send message to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //Emit the new message to the recriver socket instantly
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      receiverSocketId.forEach((socketId) => {
        io.to(socketId).emit("newMessage", newMessage);
        io.to(socketId).emit("updateUnseen"); // ✅ NEW LINE
      });
    }

    res.status(200).json({
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
