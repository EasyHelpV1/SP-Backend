/*jshint esversion: 8*/
const User = require("../models/User");
const Post = require("../models/Post");
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

const deleteUser = async (req, res) => {
  const {
    params: { email: userEmail },
  } = req;
  const user = await User.findOneAndRemove({ email: userEmail });
  if (!user) {
    throw new NotFoundError(`no user with email ${userEmail}`);
  }
  res
    .status(StatusCodes.ACCEPTED)
    .json({ message: `user ${userEmail} deleted` });
};

const deletePost = async (req, res) => {
  const { postTitle, createdBy, content } = req.body;

  const findUserEmail = await User.findOne({ email: createdBy });

  if (!findUserEmail) {
    throw new NotFoundError(`no user with given email address`);
  }

  const post = await Post.findOneAndRemove({
    title: postTitle,
    createdBy: findUserEmail._id,
    content: content,
  });
  if (!post) {
    throw new NotFoundError(`no post with given info`);
  }
  res.status(StatusCodes.ACCEPTED).json({ message: `post deleted` });
};

const findUser = async (req, res) => {
  const userEmail = req.params.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new NotFoundError(`No user with email ${userEmail}`);
  }
  res.status(StatusCodes.OK).json(user);
};

//not for changing password
const editUser = async (req, res) => {
  const userEmail = req.params.email;

  const user = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError(`no user with email ${userEmail}`);
  }

  res.status(StatusCodes.OK).json(user);
};

const addAdmin = async (req, res) => {
  const userEmail = req.params.email;

  const userToAdmin = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: { role: "admin" } },
    { new: true, runValidators: true }
  );
  if (!userToAdmin) {
    throw new NotFoundError(`no user with email ${userEmail}`);
  }
  res.status(StatusCodes.OK).json(userToAdmin);
};
const removeAdmin = async (req, res) => {
  const userEmail = req.params.email;

  const adminToUser = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: { role: "user" } },
    { new: true, runValidators: true }
  );
  if (!adminToUser) {
    throw new NotFoundError(`no user with email ${userEmail}`);
  }
  res.status(StatusCodes.OK).json(adminToUser);
};

module.exports = {
  ResetUserPassword,
  deleteUser,
  deletePost,
  findUser,
  editUser,
  addAdmin,
  removeAdmin,
};
