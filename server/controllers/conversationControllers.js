import Conversation from "../models/conversation.js";

export const createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const groupAdmins = [req.user._id];

    const conversation = await Conversation.create({
      groupName: name,
      participants,
      groupAdmins,
      isGroup: true,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "participants",
      "-password"
    );
    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId param not sent with request" });
  }

  try {
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] },
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    if (conversation) {
      return res.status(200).json({ conversation });
    }

    conversation = await Conversation.create({
      isGroup: false,
      participants: [req.user._id, userId],
    });

    const fullConversation = await conversation
      .populate("participants", "-password")
      .execPopulate();

    res.status(201).json({ conversation: fullConversation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
