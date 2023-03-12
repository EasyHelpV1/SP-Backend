/*jshint esversion: 8*/
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
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

module.exports = {
  register,
  login,
};
