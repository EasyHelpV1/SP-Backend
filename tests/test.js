/*jshint esversion: 8*/
process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const request = require("supertest");
const server = require("../app");
const Post = require("../models/Post");
chai.use(chaiHttp);

//code coverage backend vs frintend
// by 1st week after break : have all features
// documentiation: user, internal developer (work on project), external developer (use api)

let token;
let userId;
let postId;
let testUserId;

const defaultUser = {
  email: "abc@gmail.com",
  password: "newsecret",
};
const registerUserInfo = {
  firstN: "TestUser",
  lastN: "TestUser",
  birthDate: new Date("2021-11-21"),
  email: "test-user@gmail.com",
  password: "secret",
};
const newUserDetails = {
  firstN: "changed mame",
};
const newPost = {
  createdBy: String(userId),
  title: "testPostTitle",
  content: "test post content",
};
const newPostDetails = {
  title: "editTitle",
};

beforeEach((done) => {
  chai
    .request(server)
    .post("/api/v1/auth/login")
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(defaultUser)
    .end((err, res) => {
      token = res.body.token;
      userId = res.body.user._id;
      res.should.have.status(200);
      done();
    });
});

describe("/Test welcome page", () => {
  it("test default api welcome route", (done) => {
    chai
      .request(server)
      .get("/api/v1")
      .end((err, res) => {
        res.should.have.status(200);
        const actualVal = res.text;
        expect(actualVal).to.be.equal("Welcome home :)");
        done();
      });
  });
});

describe("Test Authentication", () => {
  //test login and token
  it("should login and return user and token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/login")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(defaultUser)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        const isThereToken = res.body.hasOwnProperty("token");
        expect(isThereToken).to.be.equal(true);
        done();
      });
  });

  //test regiter and token
  it("should register and return user and token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(registerUserInfo)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(201);
        res.body.should.be.a("object");
        testUserId = res.body.user._id;
        console.log("userId", testUserId);
        const isThereToken = res.body.hasOwnProperty("token");
        expect(isThereToken).to.be.equal(true);
        done();
      });
  });
});

describe("Test User", () => {
  //test getting all users
  it("should get all users", (done) => {
    chai
      .request(server)
      .get("/api/v1/users")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  //test getting one user
  it("should get one user", (done) => {
    chai
      .request(server)
      .get(`/api/v1/users/${testUserId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.a("object");
        done();
      });
  });
  //test editing a user
  it("should edit a user", (done) => {
    chai
      .request(server)
      .patch(`/api/v1/users/${testUserId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(newUserDetails)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  //test edit password

  //test deleting a user
  it("should delete a user", (done) => {
    chai
      .request(server)
      .delete(`/api/v1/users/${testUserId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(202);
        done();
      });
  });
});

//////////////////////////////
describe("Test Posts", () => {
  //test get all posts
  it("should get all posts", (done) => {
    chai
      .request(server)
      .get("/api/v1/posts")
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  //test create a post
  it("should create a post", (done) => {
    chai
      .request(server)
      .post("/api/v1/posts")
      .set({ Authorization: `Bearer ${token}` })
      .send(newPost)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(201);
        res.body.should.be.a("object");
        postId = res.body.post._id;
        console.log(res.body);
        done();
      });
  });

  //test get one post
  it("should get one post", (done) => {
    chai
      .request(server)
      .get(`/api/v1/posts/${postId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.a("object");
        done();
      });
  });

  //test edit a post
  it("should edit a post", (done) => {
    chai
      .request(server)
      .patch(`/api/v1/posts/${postId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(newPostDetails)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  //test delete a post
  it("should delete a post", (done) => {
    chai
      .request(server)
      .delete(`/api/v1/posts/${postId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(202);
        done();
      });
  });
});
