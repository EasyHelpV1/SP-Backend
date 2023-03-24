/* jshint esversion: 8*/
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllPosts = async (req, res) => {
  // var allPosts = await Post.find().sort({ "createdAt": -1 });

  // const allUsers = await User.find({}, { firstN: 1, lastN: 1 });

  // //handle error if user deleted what should we doooo?
  // function search(nameKey, myArray) {
  //   for (let i = 0; i < myArray.length; i++) {
  //     if (String(myArray[i].id) === String(nameKey)) {
  //       return myArray[i];
  //     }
  //   }
  // }

  // //map user to post, if user does not exist, skip post
  // var varPosts = allPosts.slice();
  // var mappedPosts = varPosts
  //   .filter(function (post) {
  //     if (!search(post.createdBy, allUsers)) {
  //       return false; // skip
  //     }
  //     return true;
  //   })
  //   .map(function (post) {
  //     let userId = post.createdBy;
  //     let user = search(userId, allUsers);
  //     let userFN = user.firstN;
  //     let userLN = user.lastN;
  //     post.authorName = `${userFN + " " + userLN}`;
  //     return post;
  //   });

  // this method does not handle the case of a deleted user, the last one does.
  // should we keep this, and just deleted posts made by a user when that user is deleted

  const mappedPosts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.status(StatusCodes.OK).json(mappedPosts);
};

const getOnePost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new NotFoundError(`no user with id ${postId}`);
  }
  res.status(StatusCodes.OK).json(post);
};

const editPost = async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  // return not found error if user does not exist
  if (!post) {
    throw new NotFoundError(`no user with id ${postId}`);
  }
  res.status(StatusCodes.OK).json(post);
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOneAndRemove({ _id: postId });
  if (!post) {
    throw new NotFoundError(`no user with id ${postId}`);
  }
  res.status(StatusCodes.ACCEPTED).json({ message: `post ${postId} deleted` });
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
