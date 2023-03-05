/*jshint esversion: 8*/
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getOneComment = async (req, res) => {
  const commentId = req.params.id;

  const comment = await Comment.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $match: {
        _id: ObjectId(commentId),
      },
    },
  ]);
  console.log(comment);

  if (!comment) {
    throw new NotFoundError(`no comment with id ${commentId}`);
  }

  res.status(StatusCodes.OK).json(comment);
};

const addComment = async (req, res) => {
  // get post id
  const postId = req.params.id;
  // get comment details, postid so we can connect them
  const comment = new Comment({
    content: req.body.comment,
    post: postId,
    createdBy: req.body.userId,
  });
  // save comment
  await comment.save();
  // find post and add new comment using push
  const postUpdate = await Post.findById(postId);
  postUpdate.comments.push(comment);
  // update post and save it, console err id any
  await postUpdate.save(function (err) {
    if (err) {
      console.log(err);
    }
    // res.redirect('/')
  });

  res.status(StatusCodes.OK).json(postUpdate);
};

module.exports = { getOneComment, addComment };
