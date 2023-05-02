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

const { register, login, confirm } = require("../controllers/auth");

describe("register", () => {
  it("should register a new user and send verification email", async () => {
    const req = {
      body: {
        firstN: "John",
        lastN: "Doe",
        birthDate: new Date("2021-11-21"),
        email: "user@example.com",
        password: "password123",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await register(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});

describe("login", () => {
  it("should log in a user with correct credentials", async () => {
    // Create a mock request object
    const req = {
      body: {
        email: "testuser@gmail.com",
        password: process.env.VALID_PASS,
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function
    await login(req, res);

    // Assert the expected behavior
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it("should throw BadRequestError for missing email or password", async () => {
    // Create a mock request object
    const req = {
      body: {},
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(login(req, res)).to.eventually.be.rejectedWith(
      "Please provide email and password"
    );
  });

  it("should throw UnauthenticatedError for incorrect email", async () => {
    // Create a mock request object
    const req = {
      body: {
        email: "nonexisting@example.com",
        password: "password123",
      },
    };

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(login(req, res)).to.eventually.be.rejectedWith(
      "Incorrect email"
    );
  });

  it("should throw UnauthenticatedError for incorrect password", async () => {
    // Create a mock request object
    const req = {
      body: {
        email: "testuser@gmail.com",
        password: "incorrectpassword",
      },
    };

    // Mock the User.findOne function to return a user with verified email
    const userFindOneStub = sinon.stub(User, "findOne").resolves({
      verifiedEmail: true,
      verifyPassword: sinon.stub().resolves(false),
    });

    // Create a mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Call the function and assert the expected error
    await expect(login(req, res)).to.eventually.be.rejectedWith(
      "Incorrect password"
    );

    // Restore the stubbed function
    userFindOneStub.restore();
  });
});

//sign in  and delete
describe("Sign in as admin and delete user", () => {
  let token;
  let userId;
  const defaultUser = {
    email: "testlogin@gmail.com",
    password: process.env.VALID_PASS,
  };
  //sign in
  it("should sign in as admin", (done) => {
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
  // delete the user
  it("should delete a user", (done) => {
    chai
      .request(server)
      .delete(`/api/v1/admin/DeleteUser/user@example.com`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(202);
        done();
      });
  });
});
