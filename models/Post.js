const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "please provide a post title"],
      maxlength: 50,
    },
    content: {
      type: String,
      required: [true, "please provide post content"],
      minlength: 50,
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
    authorName: {
      type: String,
      maxlength: 50,
    },
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
