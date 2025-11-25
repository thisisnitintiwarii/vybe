import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const uplaodStory = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    const { mediaType } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({
        message: "Media is required is Story",
      });
    }

    const story = await Story.create({
      author: userId,
      mediaType,
      media,
    });

    user.story = story._id;

    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({
      message: "UPLOAD STORY ERROR",
    });
  }
};

// story viewers

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({
        message: "story not found",
      });
    }

    //check that i am alreay present or not

    const alreadyView = story.viewers.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (!alreadyView) {
      story.viewers.push(req.userId);
      await story.save();
    }

    await story.populate("viewers", "name username profileImage");

    return res.status(200).json(story);
  } catch (error) {
    return res.status(500).json({
      message: "view STORY ERROR",
    });
  }
};

// getStorybyusername

export const getStory = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const story = await Story.findOne({ author: user._id })
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(story);
  } catch (error) {
    return res.status(500).json({
      message: "GET STORy ERROR",
    });
  }
};

export const getMyFriendStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const followingIds = user.following;

    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({
      message: "friends story error ERROR",
    });
  }
};
