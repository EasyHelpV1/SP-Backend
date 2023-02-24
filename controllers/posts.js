/* jshint esversion: 8*/
const Post = require("../models/Post");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllPosts = async (req, res) => {
  var allPosts = await Post.find().sort({ "createdAt": -1 });

  const allUsers = await User.find({}, { firstN: 1, lastN: 1 });

  function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      // console.log(myArray[i].id, String(nameKey));
      if (String(myArray[i].id) === String(nameKey)) {
        return myArray[i];
      }
    }
  }

  var varPosts = allPosts.slice();

  const mappedPosts = varPosts.map((post) => {
    let userId = post.createdBy;
    let user = search(userId, allUsers);
    // console.log(user);
    let userFN = user.firstN;
    let userLN = user.lastN;
    post.authorName = `${userFN + " " + userLN}`;
    return post;
  });

  // console.log(mappedPosts);

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
