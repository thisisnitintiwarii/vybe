import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      require: true,
    },
    media: {
      type: String,
      require: true,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 86400, // beacuse in seconds
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);
export default Story;
