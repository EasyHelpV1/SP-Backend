/*jshint esversion: 8*/
require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const { stub } = require("sinon");
const { getOneReply, addReply } = require("../controllers/reply");
const Reply = require("../models/Reply");
const Comment = require("../models/Comment");

describe("addReply", () => {
  it("should add a new reply to a comment", async () => {
    const commentId = "Comment456";
    const replyId = "Reply123";

    const commentInstanceStub = sinon.stub(Comment, "findById").resolves({
      _id: commentId,
      replies: [],
    });

    const replyInstanceStub = sinon.stub(Reply.prototype, "save").resolves({
      _id: replyId,
      content: "New Reply",
      createdBy: "User123",
      comment: commentId,
    });

    const req = {
      params: {
        id: commentId,
      },
      body: {
        reply: "New Reply",
        userId: "User123",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // await addReply(req, res);
  });
});
