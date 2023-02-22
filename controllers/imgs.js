const { StatusCodes } = require("http-status-codes");
const imgModel = require("../models/Img");
const User = require("../models/User");

const getOneImg = async (req, res) => {
  const {
    params: { id: imgId },
  } = req;
  var anImg = await imgModel.findOne({ _id: imgId });
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
  console.log(getUser);
  const userUpdate = await User.findOneAndUpdate({ _id: userId }, getUser, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.CREATED).json({ imgCreated, userUpdate });
};

module.exports = {
  getOneImg,
  createImg,
};
