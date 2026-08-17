import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],

    // Uploaded file URL
    mediaUrl: {
      type: String,
      default: null,
    },

    // image or video
    mediaType: {
      type: String,
      enum: ["image", "video", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);