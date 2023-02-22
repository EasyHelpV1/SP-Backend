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
      maxlength: 200,
    },
    // location: {
    //   type: String,
    //   required: [true, "please provide location"],
    // },
    // time: {
    //   type: String,
    //   required: [true, "please provide time"],
    // },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
    authorName: {
      type: String,
      require: [true, "please provide author name"],
      maxlength: 50,
    },
    replies: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
