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
      minlength: 25,
      maxlength: 1000,
    },
    date: {
      type: Date,
      required: [true, "please provide date"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "please provide location"],
    },
    money: {
      type: String,
      enum: ["paid", "unpaid"],
      required: [true, "please provide paid or not"],
    },
    time: {
      type: String,
      required: [true, "please provide estimated time"],
    },
    urgency: {
      type: Boolean,
      required: [true, "please provide urgent or not"],
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
