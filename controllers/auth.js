const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.firstN }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // if (!email || !password) {
  //   // handle error
  //   res
  //     .status(StatusCodes.BAD_REQUEST)
  //     .json({ msg: "email or password missing" });
  // }

  console.log(email);

  const user = await User.findOne({ email });

  // if (!user) {
  //   //handle error
  //   res.status(StatusCodes.UNAUTHORIZED).json({ msg: "user not found" });
  // }

  const verified = await user.verifyPassword(password);

  // if (!verified) {
  //   //handle error
  //   res.status(StatusCodes.UNAUTHORIZED).json({ msg: "wrong password" });
  // }
  console.log(user);

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
};

module.exports = {
  register,
  login,
};
