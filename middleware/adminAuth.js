/* jshint esversion: 9 */
/* jshint node: true */
const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      throw new UnauthenticatedError("Not an Admin");
    }
    // attach the user to the routes
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid: not an admin");
  }
};

module.exports = adminAuth;
