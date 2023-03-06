/*jshint esversion: 8*/
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json(users);
};

const getOneUser = async (req, res) => {
  const {
    params: { id: userId },
  } = req;
  const user = await User.findOne({
    _id: userId,
  });
  // return not found error if user does not exist
  if (!user) {
    throw new NotFoundError(`no user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json(user);
};

//not for changing password
const editUser = async (req, res) => {
  const {
    params: { id: userId },
  } = req;

  console.log(userId, req.body);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  // return not found error if user does not exist
  if (!user) {
    throw new NotFoundError(`no user with id ${userId}`);
  }
  //make sure that values do not set to empty? or check it on frontend
  //handle mongodb errors of invalid email
  res.status(StatusCodes.OK).json(user);
};

const deleteUser = async (req, res) => {
  const {
    params: { id: userId },
  } = req;
  const user = await User.findOneAndRemove({ _id: userId });
  if (!user) {
    throw new NotFoundError(`no user with id ${userId}`);
  }
  res.status(StatusCodes.ACCEPTED).json({ message: `user ${userId} deleted` });
};

const editPassword = async (req, res) => {
  const {
    params: { id: userId },
    body: { oldPassword, newPassword },
  } = req;
  const userVerify = await User.findOne({ _id: userId });
  // return not found error if user does not exist
  if (!userVerify) {
    throw new NotFoundError(`no user with id ${userId}`);
  }
  const verified = await userVerify.verifyPassword(oldPassword);
  if (!verified) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "wrong old password" });
  }
  const user = await User.updateOne(
    { _id: userId },
    { $set: { password: newPassword } },
    { new: true, runValidators: true }
  );
  //handle mongodb errors of invalid email
  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getAllUsers,
  getOneUser,
  editUser,
  deleteUser,
  editPassword,
};
