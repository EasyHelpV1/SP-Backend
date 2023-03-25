/*jshint esversion: 8*/
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const verifyEmail = require("../services/emails");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  // verify email
  const emailToken = user.emailToken();
  verifyEmail(req.body.firstN, req.body.lastN, req.body.email, emailToken);

  res.status(StatusCodes.CREATED).json({ user: { _id: user._id }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Incorrect email");
  }

  if (!user.verifiedEmail) {
    throw new UnauthenticatedError("Email not confirmed");
  }

  const verified = await user.verifyPassword(password);
  if (!verified) {
    //handle error
    throw new UnauthenticatedError("Incorrect password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: { _id: user._id },
    token,
  });
};

const confirm = async (req, res) => {
  const token = req.params.token;
  const email = req.params.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("user not found");
  }
  const verified = await user.verifyToken(token);
  if (!verified) {
    //handle error
    throw new UnauthenticatedError("not verified");
  }
  const confirmIt = await User.findOneAndUpdate(
    { email: email },
    { verifiedEmail: true },
    { new: true, runValidators: true }
  );
  console.log(verified, confirmIt);
  res
    .status(StatusCodes.OK)
    .redirect(`${process.env.LINK_ADDRESS_FRONT}/confirmed`);
};

module.exports = {
  register,
  login,
  confirm,
};
