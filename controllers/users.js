const Post = require("../models/Post");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  const users = User.find();
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
  res.status(StatusCodes.OK).json(user);
};

const editUser = async (req, res) => {
  const {
    body: { firstN, lastN, email, phone, password },
    params: { id: userId },
  } = req;

  if (firstN === "" || lastN === "" || email === "" || password === "") {
    // throw new BadRequuestError("First name, last name, and email connot be empty")
    console.log("First name, last name, and email connot be empty");
  }

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  // return not found error if user does not exist
  res.status(StatusCodes.OK).json(user);
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers,
  getOneUser,
  editUser,
  deleteUser,
};
