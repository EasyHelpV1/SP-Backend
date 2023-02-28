const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  editUser,
  deleteUser,
  editPassword,
} = require("../controllers/users");

router.route("/").get(getAllUsers);
router.route("/:id").get(getOneUser).patch(editUser).delete(deleteUser);
router.route("/changePassword/:id").patch(editPassword);

module.exports = router;
