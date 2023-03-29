/*jshint esversion: 8*/
const User = require("../models/User");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const ResetUserPassword = async (req, res) => {
  const { email, birthDate, password } = req.body;
  const userVerify = await User.findOne({ email: email, birthDate: birthDate });
  // return not found error if user does not exist
  if (!userVerify) {
    throw new NotFoundError(
      `no user with email ${email} and birth date ${birthDate}`
    );
  }
  const userId = userVerify._id;
  const user = await User.updateOne(
    { _id: userId },
    { $set: { password: password } },
    { new: true, runValidators: true }
  );
  //handle mongodb errors of invalid email
  res.status(StatusCodes.OK).json(user);
};

module.exports = { ResetUserPassword };
