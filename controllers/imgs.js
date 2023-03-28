/*jshint esversion: 8*/
const { StatusCodes } = require("http-status-codes");
const imgModel = require("../models/Img");
const User = require("../models/User");

const getOneImg = async (req, res) => {
  const {
    params: { id: imgId },
  } = req;
  const anImg = await imgModel.findOne({ _id: imgId });
  // console.log(imgId);
  if (!anImg) {
    throw new NotFoundError(`no image with id ${imgId}`);
  }
  res.status(StatusCodes.OK).json(anImg);
};

const createImg = async (req, res) => {
  const anImg = {
    img: req.file.buffer,
    createdBy: req.body.userId,
  };
  const imgCreated = await imgModel.create(anImg);
  const userId = req.body.userId;
  const getUser = await User.findOne({
    _id: userId,
  });
  getUser.userImg = imgCreated;
  // console.log(getUser);
  const userUpdate = await User.findOneAndUpdate({ _id: userId }, getUser, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.CREATED).json({ imgCreated, userUpdate });
};

const deleteImg = async (req, res) => {
  const {
    params: { id: imgId },
  } = req;
  const deleteImg = await imgModel.findOneAndRemove({ _id: imgId });
  res.status(StatusCodes.OK).json({});
};
const changeImg = async (req, res) => {};

module.exports = {
  getOneImg,
  createImg,
  deleteImg,
  changeImg,
};
