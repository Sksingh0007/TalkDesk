import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { io, userSocketMap } from "../server.js";

//Get all users except the logged in user

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    // Get the logged-in user with friends populated
    const me = await User.findById(userId).populate({
      path: "friends",
      select: "-password",
    });
    const filteredUsers = me.friends;

    //Count number of message not seen and get last message for sorting
    const unseenMessages = {};
    const usersWithLastMessage = await Promise.all(
      filteredUsers.map(async (user) => {
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

        // Find the last message exchanged with this user
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: user._id },
            { senderId: user._id, receiverId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        // Debug log
        console.log(`User: ${user.fullName}, lastMessage:`, lastMessage);

        return {
          ...user.toObject(),
          lastMessage,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithLastMessage,
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
    // Mark as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    // Find all messages just marked as seen
    const seenMessages = await Message.find({
      senderId: selectedUserId,
      receiverId: myId,
      seen: true,
    }).select("_id");
    // Emit messageSeen event to sender
    const senderSocketIds = userSocketMap[selectedUserId];
    if (senderSocketIds && seenMessages.length > 0) {
      senderSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messageSeen", {
          userId: myId,
          messageIds: seenMessages.map((m) => m._id.toString()),
        });
        io.to(socketId).emit("updateUnseen"); // Ensure sidebar unseen count updates
      });
    }
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