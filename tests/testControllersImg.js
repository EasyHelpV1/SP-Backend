/*jshint esversion: 8*/
require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const { StatusCodes } = require("http-status-codes");
const imgModel = require("../models/Img");
const User = require("../models/User");
const {
  getOneImg,
  createImg,
  deleteImg,
  changeImg,
} = require("../controllers/imgs");

describe("Img Controller", () => {
  describe("getOneImg", () => {
    it("should retrieve a single image", async () => {
      const imgId = "imageId";
      const anImg = {
        _id: imgId,
        // other properties of the image
      };
      const findOneStub = sinon.stub(imgModel, "findOne").resolves(anImg);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await getOneImg({ params: { id: imgId } }, res);

      expect(findOneStub.calledOnceWith({ _id: imgId })).to.be.true;
      expect(res.status.calledOnceWith(StatusCodes.OK)).to.be.true;
      expect(res.json.calledOnceWith(anImg)).to.be.true;

      findOneStub.restore();
    });

    it("should throw an error if image is not found", async () => {
      const imgId = "nonExistingId";
      const findOneStub = sinon.stub(imgModel, "findOne").resolves(null);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      try {
        await getOneImg({ params: { id: imgId } }, res);
      } catch (error) {
        expect(error.message).to.equal(`no image with id ${imgId}`);
        expect(findOneStub.calledOnceWith({ _id: imgId })).to.be.true;
        // expect(res.status.calledOnceWith(StatusCodes.NOT_FOUND)).to.be.true;
        // expect(res.json.calledOnceWith({ error: error.message })).to.be.true;
      }

      findOneStub.restore();
    });
  });

  describe("createImg", () => {
    it("should create a new image and update the user", async () => {
      const userId = "userId";
      const imgBuffer = Buffer.from("imageData");
      const imgCreated = {
        _id: "newImageId",
        // other properties of the new image
      };
      const getUser = {
        _id: userId,
        // other properties of the user
      };
      const createStub = sinon.stub(imgModel, "create").resolves(imgCreated);
      const findOneStub = sinon.stub(User, "findOne").resolves(getUser);
      const findOneAndUpdateStub = sinon
        .stub(User, "findOneAndUpdate")
        .resolves(getUser);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await createImg({ file: { buffer: imgBuffer }, body: { userId } }, res);

      expect(createStub.calledOnceWith({ img: imgBuffer, createdBy: userId }))
        .to.be.true;
      expect(findOneStub.calledOnceWith({ _id: userId })).to.be.true;
      expect(getUser.userImg).to.equal(imgCreated);
      expect(
        findOneAndUpdateStub.calledOnceWith({ _id: userId }, getUser, {
          new: true,
          runValidators: true,
        })
      ).to.be.true;
      expect(res.status.calledOnceWith(StatusCodes.CREATED)).to.be.true;
      expect(res.status.calledOnceWith(StatusCodes.CREATED)).to.be.true;
      //   expect(res.json.calledOnceWith({ imgCreated, userUpdate })).to.be.true;

      createStub.restore();
      findOneStub.restore();
      findOneAndUpdateStub.restore();
    });
  });

  describe("deleteImg", () => {
    it("should delete an image", async () => {
      const imgId = "imageId";
      const findOneAndRemoveStub = sinon.stub(imgModel, "findOneAndRemove");
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await deleteImg({ params: { id: imgId } }, res);

      expect(findOneAndRemoveStub.calledOnceWith({ _id: imgId })).to.be.true;
      expect(res.status.calledOnceWith(StatusCodes.OK)).to.be.true;
      expect(res.json.calledOnceWith({})).to.be.true;

      findOneAndRemoveStub.restore();
    });
  });

  describe("changeImg", () => {
    it("should update an image", async () => {
      const imgId = "imageId";
      const updateData = {
        // update data for the image
      };
      const findOneAndUpdateStub = sinon.stub(imgModel, "findOneAndUpdate");
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await changeImg({ params: { id: imgId }, body: updateData }, res);

      //   expect(
      //     findOneAndUpdateStub.calledOnceWith({ _id: imgId }, updateData, {
      //       new: true,
      //       runValidators: true,
      //     })
      //   ).to.be.true;
      //   expect(res.status.calledOnceWith(StatusCodes.OK)).to.be.true;
      //   expect(res.json.calledOnceWith({})).to.be.true;

      //   findOneAndUpdateStub.restore();
    });
  });
});
