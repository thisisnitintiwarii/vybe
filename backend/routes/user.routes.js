import express from "express";
import {
  editProfile,
  follow,
  getCurrentuser,
  getProfile,
  suggestedUsers,
  followingList,
  search,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentuser);
userRouter.get("/suggested", isAuth, suggestedUsers);
userRouter.get("/getProfile/:username", isAuth, getProfile);
userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);
userRouter.get("/follow/:targetUserId", isAuth, follow);

userRouter.get("/followingList", isAuth, followingList);

userRouter.get("/search", isAuth, search);

export default userRouter;
