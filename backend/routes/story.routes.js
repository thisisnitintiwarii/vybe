import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  getMyFriendStory,
  getStory,
  uplaodStory,
  viewStory,
} from "../controllers/story.controllers.js";

const storyRouter = express.Router();

storyRouter.post("/upload", isAuth, upload.single("media"), uplaodStory);

storyRouter.get("/getStory/:username", isAuth, getStory);

storyRouter.post("/view/:storyId", isAuth, viewStory);

storyRouter.get("/getMyFriends", isAuth, getMyFriendStory);

export default storyRouter;
