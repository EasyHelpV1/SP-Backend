/*jshint esversion: 8*/
const Reply = require("../models/Reply");
const Comment = require("../models/Comment");
// const Post = require("../models/Post");
// const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getOneReply = async (req, res) => {
  const replyId = req.params.id;

  const reply = await Reply.aggregate([
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
        _id: ObjectId(replyId),
      },
    },
  ]);
  // console.log(reply);

  if (!reply) {
    throw new NotFoundError(`no reply with id ${replyId}`);
  }

  res.status(StatusCodes.OK).json(reply);
};

const addReply = async (req, res) => {
  // get commnet id
  const commentId = req.params.id;
  // get reply details, postid so we can connect them
  const reply = new Reply({
    content: req.body.reply,
    createdBy: req.body.userId,
    comment: commentId,
    // post: req.body.postId,
  });
  // save reply
  await reply.save();
  // find comment and add new reply using push
  const commentUpdate = await Comment.findById(commentId);
  commentUpdate.replies.push(reply);
  // update comment and save it, console err id any
  await commentUpdate.save(function (err) {
    if (err) {
      console.log(err);
    }
    // res.redirect('/')
  });

  res.status(StatusCodes.OK).json(commentUpdate);
};

module.exports = { getOneReply, addReply };
