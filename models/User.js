const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "user",
  },
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
  verifiedEmail: {
    type: Boolean,
    default: false,
    required: true,
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
//passwword reset
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
    { userId: this._id, name: this.firstN + this.lastN, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.emailToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.firstN + this.lastN },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

UserSchema.methods.verifyPassword = async function (givenPassword) {
  const verified = await bcrypt.compare(givenPassword, this.password);
  return verified;
};
UserSchema.methods.verifyToken = async function (givenToken) {
  const verified = jwt.verify(givenToken, process.env.JWT_SECRET);
  return verified;
};

module.exports = mongoose.model("User", UserSchema);
