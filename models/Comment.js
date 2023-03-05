/*jshint esversion: 8*/
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "please provide comment content"],
      minkength: 50,
      maxlength: 200,
    },
    replies: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide author"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);
