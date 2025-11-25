import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  getAllMessage,
  getPreviousUserChats,
  sendMessage,
} from "../controllers/message.controllers.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:reciverId",
  isAuth,
  upload.single("image"),
  sendMessage
);

messageRouter.get("/getAllMessages/:reciverId", isAuth, getAllMessage);

messageRouter.get("/getAllPreviousChats", isAuth, getPreviousUserChats);

export default messageRouter;
