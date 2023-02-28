const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstN: {
    type: String,
    required: [true, "Please provide a first name"],
    minlength: 3,
    maxlenght: 50,
  },
  lastN: {
    type: String,
    required: [true, "Please provide a last name"],
    minlength: 3,
    maxlenght: 50,
  },
  birthDate: {
    type: Date,
    required: [true, "please provide a birth date"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
    unique: true,
  },
  phone: {
    type: String,
    match: [/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 6,
  },
  // userImg: {
  //   type: Buffer, // casted to MongoDB's BSON type: binData
  // },
  userImg: {
    type: mongoose.Types.ObjectId,
    ref: "Img",
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.pre("updateOne", async function (next) {
  const salt = await bcrypt.genSalt(12);
  this._update.$set.password = await bcrypt.hash(
    this._update.$set.password,
    salt
  );
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.verifyPassword = async function (givenPassword) {
  const verified = await bcrypt.compare(givenPassword, this.password);
  return verified;
};

module.exports = mongoose.model("User", UserSchema);
