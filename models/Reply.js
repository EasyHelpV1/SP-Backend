/*jshint esversion: 8*/
const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "please provide reply content"],
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide author"],
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      required: [true, "please provide comment"],
    },
    // post: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "Post",
    //   required: [true, "please provide post"],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("reply", ReplySchema);
