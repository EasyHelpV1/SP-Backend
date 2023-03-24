/*jshint esversion: 8*/
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "please provide comment content"],
      maxlength: 500,
    },
    replies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Reply",
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide author"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "please provide post"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);
