/* jshint esversion: 8*/
const Post = require("../models/Post");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllPosts = async (req, res) => {
  var allPosts = await Post.find().sort({ "createdAt": -1 });

  const allUsers = await User.find({}, { firstN: 1, lastN: 1 });

  //handle error if user deleted what should we doooo?
  function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (String(myArray[i].id) === String(nameKey)) {
        return myArray[i];
      }
    }
  }

  //map user to post, if user does not exist, skip post
  var varPosts = allPosts.slice();
  var mappedPosts = varPosts
    .filter(function (post) {
      if (!search(post.createdBy, allUsers)) {
        return false; // skip
      }
      return true;
    })
    .map(function (post) {
      let userId = post.createdBy;
      let user = search(userId, allUsers);
      let userFN = user.firstN;
      let userLN = user.lastN;
      post.authorName = `${userFN + " " + userLN}`;
      return post;
    });

  res.status(StatusCodes.OK).json(mappedPosts);
};

const getOnePost = async (req, res) => {
  res.send("get post");
};

const editPost = async (req, res) => {
  res.send("edit post");
};

const deletePost = async (req, res) => {
  res.send("delete post");
};

const createPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

module.exports = {
  getAllPosts,
  getOnePost,
  editPost,
  deletePost,
  createPost,
};
