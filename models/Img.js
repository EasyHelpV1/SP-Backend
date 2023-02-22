const mongoose = require("mongoose");

const ImgSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    // },
    // desc: {
    //   type: String,
    // },
    img: {
      type: Buffer, // casted to MongoDB's BSON type: binData
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("img", ImgSchema);
