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

export const updateGroupInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName, groupImage } = req.body;
    const userId = req.user._id;

    // Find conversation and check if user is admin
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({
        success: false,
        message: "This is not a group conversation",
      });
    }

    if (!conversation.groupAdmins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can update group info",
      });
    }

    // Update group info
    const updateData = {};
    if (groupName) updateData.groupName = groupName;
    if (groupImage) updateData.groupImage = groupImage;

    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("participants", "-password");

    res.status(200).json({
      success: true,
      conversation: updatedConversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addGroupMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const adminId = req.user._id;

    // Find conversation and check if user is admin
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({
        success: false,
        message: "This is not a group conversation",
      });
    }

    if (!conversation.groupAdmins.includes(adminId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can add members",
      });
    }

    // Check if user is already a member
    if (conversation.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this group",
      });
    }

    // Add user to participants
    conversation.participants.push(userId);
    await conversation.save();

    const updatedConversation = await Conversation.findById(id)
      .populate("participants", "-password");

    res.status(200).json({
      success: true,
      conversation: updatedConversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const adminId = req.user._id;

    // Find conversation and check if user is admin
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.isGroup) {
      return res.status(400).json({
        success: false,
        message: "This is not a group conversation",
      });
    }

    if (!conversation.groupAdmins.includes(adminId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can remove members",
      });
    }

    // Check if user is a member
    if (!conversation.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this group",
      });
    }

    // Don't allow removing admins
    if (conversation.groupAdmins.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove group admin",
      });
    }

    // Check minimum member requirement
    if (conversation.participants.length <= 2) {
      return res.status(400).json({
        success: false,
        message: "Group must have at least 2 members",
      });
    }

    // Remove user from participants
    conversation.participants = conversation.participants.filter(
      (participant) => participant.toString() !== userId
    );
    await conversation.save();

    const updatedConversation = await Conversation.findById(id)
      .populate("participants", "-password");

    res.status(200).json({
      success: true,
      conversation: updatedConversation,
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
    return res.status(400).json({ 
      success: false,
      message: "UserId param not sent with request" 
    });
  }

  try {
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] },
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    if (conversation) {
      return res.status(200).json({ 
        success: true,
        conversation 
      });
    }

    // Create new conversation
    conversation = await Conversation.create({
      isGroup: false,
      participants: [req.user._id, userId],
    });

    // Populate the conversation
    const fullConversation = await Conversation.findById(conversation._id)
      .populate("participants", "-password");

    res.status(201).json({ 
      success: true,
      conversation: fullConversation 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
