import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({
        message: "Media is required",
      });
    }
    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name username profileImage"
    );

    return res.status(200).json(populatedPost);
  } catch (error) {
    return res.status(500).json({
      message: "uplaod Post errror",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author", "name username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "GET ALL POST ERROR",
    });
  }
};

// req.postId on which i cliked to like
// then just find the post using that id
// this post.like array push -> req.userId
export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "POST NOT FOUND",
      });
    }

    const isPreLiked = post.likes.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (isPreLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    await post.populate("author", "name username profileImage");

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "LIKE CONTROLLER ERROR",
    });
  }
};

export const comment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const postId = req.params.postId;

    const userId = req.userId;

    // now i have author and message both
    // find the post using post id and push both details

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "Post with given Id not fount",
      });
    }

    post.comments.push({
      author: userId,
      message: commentText,
    });

    await post.save();

    await post.populate("author", "username profileImage name");
    await post.populate("comments.author");

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: "COMMENT CONTROLLER ERROR",
    });
  }
};

export const saved = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const user = await User.findById(userId);

    const alreadySaved = user.saved.some(
      (id) => id.toString() == postId.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() != postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    await user.populate("saved");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "SAVED CONTROLLER ERROR",
    });
  }
};
