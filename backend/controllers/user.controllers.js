import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentuser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("posts loops following");

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `getCurrentUser error ${error}`,
    });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const user = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `suggested User  error ${error}`,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    //check username is available

    const sameUserWithUsername = await User.findOne({ username }).select(
      "-password"
    );

    if (sameUserWithUsername && sameUserWithUsername._id != req.userId) {
      return res.status(400).json({
        message: "Username Already Exists",
      });
    }

    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
      user.profileImage = profileImage;
    }

    user.name = name;
    user.username = username;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `Edit profile error ${error}`,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username })
      .select("-password")
      .populate("posts loops followers following");

    if (!user) {
      return res.status(400).json({
        message: "Username Already Exists",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `Get Profile  error ${error}`,
    });
  }
};

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
      return res.status(400).json({
        message: "targetUserId not fount",
      });
    }
    // is im already his friend

    if (currentUserId == targetUserId) {
      return res.status(400).json({
        message: "You can not follow yourself",
      });
    }

    const currentuser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    const isFollowing = currentuser.following.includes(targetUserId);

    if (isFollowing) {
      currentuser.following = currentuser.following.filter(
        (val) => val.toString() != targetUserId.toString()
      );

      targetUser.followers = targetUser.followers.filter(
        (val) => val.toString() != currentUserId.toString()
      );

      await currentuser.save();
      await targetUser.save();

      return res.status(200).json({
        following: false,
        message: "unfollow Successfully",
      });
    } else {
      currentuser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentuser.save();
      await targetUser.save();

      return res.status(200).json({
        following: true,
        message: "follow Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "follow controller errro",
    });
  }
};

export const followingList = async (req, res) => {
  try {
    const result = await User.findById(req.userId);
    return res.status(200).json(result?.following);
  } catch (error) {
    return res.status(500).json({
      message: "following list errro",
    });
  }
};

export const search = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();

    // Validate keyword
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    // Search users based on username or name
    const users = await User.find({
      $or: [
        { userName: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({ message: "Search people error" });
  }
};
