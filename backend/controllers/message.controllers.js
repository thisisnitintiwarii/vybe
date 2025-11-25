import { getSocketId, io } from "../socket.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const reciverId = req.params.reciverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      reciver: reciverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const recvierSocketId = getSocketId(reciverId);
    if (recvierSocketId) {
      io.to(recvierSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({
      message: "send Message Error",
    });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const reciverId = req.params.reciverId;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("messages");

    return res.status(200).json(conversation.messages);
  } catch (error) {
    return res.status(500).json({
      message: "get AllMessage Error",
    });
  }
};

export const getPreviousUserChats = async (req, res) => {
  try {
    const currentuser = req.userId;

    const converstaions = await Conversation.find({
      participants: currentuser,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};

    converstaions.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id != currentuser) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUser = Object.values(userMap);

    return res.status(200).json(previousUser);
  } catch (error) {
    return res.status(500).json({
      message: "getPreviousUser Chats Error",
    });
  }
};
