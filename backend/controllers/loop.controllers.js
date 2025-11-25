import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Loop from "../models/loop.model.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({
        message: "Media is required",
      });
    }
    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.loops.push(loop._id);
    await user.save();

    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "name username profileImage"
    );

    return res.status(200).json(populatedLoop);
  } catch (error) {
    return res.status(500).json({
      message: "uplaod Loop errror",
    });
  }
};

export const like = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(400).json({
        message: "LOOP NOT FOUND",
      });
    }

    const isPreLiked = loop.likes.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (isPreLiked) {
      loop.likes = loop.likes.filter((id) => id.toString() != req.userId.toString());
    } else {
      loop.likes.push(req.userId);
    }

    await loop.save();

    await loop.populate("author", "name username profileImage");

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({
      message: "LIKE CONTROLLER ERROR",
    });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const loopId = req.params.loopId;

    const userId = req.userId;

    // now i have author and message both
    // find the loop using loop id and push both details

    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(400).json({
        message: "Loop with given Id not fount",
      });
    }

    loop.comments.push({
      author: userId,
      message,
    });

    await loop.save();

    await loop.populate("author", "username profileImage name");
    await loop.populate("comments.author");

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({
      message: "LOOP COMMENT CONTROLLER ERROR",
    });
  }
};

export const getAllLoop = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author");

    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json({
      message: "GET ALL LOOPS ERROR",
    });
  }
};
