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
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
    authorName: {
      type: String,
      // required: [true, "please provide author name"],
      maxlength: 50,
    },
    // comments: {
    //   type: Array,
    //   default: [],
    // },
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
