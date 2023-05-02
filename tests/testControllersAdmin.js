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

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const {
  ResetUserPassword,
  deleteUser,
  deletePost,
  findUser,
  editUser,
  addAdmin,
  removeAdmin,
} = require("../controllers/adminActions");

let token;
let userId;
const defaultUser = {
  email: "testlogin@gmail.com",
  password: process.env.VALID_PASS,
};

const resetPassuser = {
  email: "testuser@gmail.com",
  birthDate: "2021-11-21",
  password: process.env.VALID_PASS,
};
const mockPost = {
  title: "Post 1",
  date: "2023-04-30T10:00:00Z",
  location: "Location 1",
  money: "paid",
  time: "10:00 AM",
  urgency: true,
  content: "Post content 1",
};

beforeEach((done) => {
  chai
    .request(server)
    .post("/api/v1/auth/login")
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(defaultUser)
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.token;
      userId = res.body.user._id;
      done();
    });
});
describe("ResetUserPassword", () => {
  it("should reset user password", async () => {
    // Create a mock request object
    const req = {
      body: {
        email: resetPassuser.email,
        birthDate: resetPassuser.birthDate,
        password: resetPassuser.password,
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await ResetUserPassword(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      body: {
        email: "nonexisting@example.com",
        birthDate: "1990-01-01",
        password: "newpassword",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(ResetUserPassword(req, res)).to.eventually.be.rejectedWith(
      `no user with email nonexisting@example.com and birth date 1990-01-01`
    );
  });
});

describe("deleteUser", () => {
  // first create the user
  it("should register and return user and token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        firstN: "DeleteUser",
        lastN: "DeleteUser",
        birthDate: new Date("2021-11-21"),
        email: "DeleteUser@gmail.com",
        password: "secretYeaHaHaHa",
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("should delete user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "DeleteUser@gmail.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await deleteUser(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(202)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "nonexisting@example.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(deleteUser(req, res)).to.be.rejectedWith(
      "no user with email nonexisting@example.com"
    );
  });
});

describe("deletePost", () => {
  // first create the post
  it("should create a post", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set({ Authorization: `Bearer ${token}` })
      .send(mockPost)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it("should delete post", async () => {
    // Create a mock request object
    const req = {
      body: {
        postTitle: mockPost.title,
        createdBy: defaultUser.email,
        content: mockPost.content,
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await deletePost(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(202)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing post", async () => {
    // Create a mock request object
    const req = {
      body: {
        postTitle: "Non-existing Post",
        createdBy: "user@example.com",
        content: "This post does not exist.",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(deletePost(req, res)).to.eventually.be.rejectedWith(
      "no user with given email address"
    );
  });
});

describe("findUser", () => {
  it("should find user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: defaultUser.email,
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await findUser(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "nonexisting@example.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(findUser(req, res)).to.eventually.be.rejectedWith(
      "No user with email nonexisting@example.com"
    );
  });
});

describe("editUser", () => {
  it("should edit user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "edituser@gmail.com",
      },
      body: {
        name: "John Doe",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await editUser(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "nonexisting@example.com",
      },
      body: {
        name: "John Doe",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(editUser(req, res)).to.eventually.be.rejectedWith(
      "no user with email nonexisting@example.com"
    );
  });
});

describe("addAdmin", () => {
  it("should add admin role to user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "edituser@gmail.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await addAdmin(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "nonexisting@example.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(addAdmin(req, res)).to.eventually.be.rejectedWith(
      "no user with email nonexisting@example.com"
    );
  });
});

describe("removeAdmin", () => {
  it("should remove admin role from user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "edituser@gmail.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await removeAdmin(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw NotFoundError for non-existing user", async () => {
    // Create a mock request object
    const req = {
      params: {
        email: "nonexisting@example.com",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(removeAdmin(req, res)).to.eventually.be.rejectedWith(
      "no user with email nonexisting@example.com"
    );
  });
});
