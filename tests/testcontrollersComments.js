/*jshint esversion: 8*/
require("dotenv").config();
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();

const chaiHttp = require("chai-http");
const request = require("supertest");
const { describe, it } = require("mocha");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");

const { StatusCodes } = require("http-status-codes");
const server = require("../app");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { NotFoundError } = require("../errors");
const mongoose = require("mongoose");

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const { getOneComment, addComment } = require("../controllers/comment");

beforeEach(async () => {
  await Comment.deleteMany();
});

describe("getOneComment", () => {
  it("should get a comment by ID", async () => {
    const commentId = mongoose.Types.ObjectId();
    const commentData = {
      _id: commentId,
      content: "Test comment",
      createdBy: mongoose.Types.ObjectId(),
    };
    const aggregateStub = sinon
      .stub(Comment, "aggregate")
      .returns([commentData]);

    const req = {
      params: { id: commentId },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await getOneComment(req, res);

    expect(aggregateStub.calledOnce).to.be.true;
    expect(aggregateStub.args[0][0]).to.deep.equal([
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
          _id: commentId,
        },
      },
    ]);
    expect(res.status.calledOnceWith(StatusCodes.OK)).to.be.true;
    expect(res.json.calledOnceWith([commentData])).to.be.true;

    aggregateStub.restore();
  });
});

describe("addComment", () => {
  it("should add a new comment to a post", async () => {
    const postId = mongoose.Types.ObjectId();
    const userId = mongoose.Types.ObjectId();
    const commentData = {
      comment: "Test comment",
      userId: userId,
    };
    const comment = new Comment(commentData);
    const postUpdate = {
      _id: postId,
      comments: [],
      save: sinon.stub().resolves(),
    };
    const findByIdStub = sinon.stub(Post, "findById").resolves(postUpdate);
    const saveStub = sinon.stub(comment, "save").resolves();

    const req = {
      params: { id: postId },
      body: commentData,
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await addComment(req, res);
  });
});
