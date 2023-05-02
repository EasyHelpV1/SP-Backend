/*jshint esversion: 8*/
const { expect } = require("chai");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = require("../middleware/error-handler");
describe("Error Handler Middleware", () => {
  it("should return default error response", () => {
    const err = {
      message: "Something went wrong",
    };
    const req = {};
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
        return res;
      },
      json: (data) => {
        expect(data.msg).to.equal("Something went wrong");
      },
    };
    const next = () => {};

    errorHandlerMiddleware(err, req, res, next);
  });

  it("should handle validation errors", () => {
    const err = {
      name: "ValidationError",
      errors: {
        name: {
          message: "Name is required",
        },
        email: {
          message: "Invalid email format",
        },
      },
    };
    const req = {};
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        return res;
      },
      json: (data) => {
        expect(data.msg).to.equal("Name is required,Invalid email format");
      },
    };
    const next = () => {};

    errorHandlerMiddleware(err, req, res, next);
  });

  it("should handle duplicate key errors", () => {
    const err = {
      code: 11000,
      keyValue: {
        email: "test@example.com",
      },
    };
    const req = {};
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(StatusCodes.BAD_REQUEST);
        return res;
      },
      json: (data) => {
        expect(data.msg).to.equal(
          "email already exists, please choose another, or try to log in instead"
        );
      },
    };
    const next = () => {};

    errorHandlerMiddleware(err, req, res, next);
  });

  it("should handle cast errors", () => {
    const err = {
      name: "CastError",
      value: "123",
    };
    const req = {};
    const res = {
      status: (statusCode) => {
        expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
        return res;
      },
      json: (data) => {
        expect(data.msg).to.equal("No item found with id : 123");
      },
    };
    const next = () => {};

    errorHandlerMiddleware(err, req, res, next);
  });
});
