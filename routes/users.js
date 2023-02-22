const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  editUser,
  deleteUser,
} = require("../controllers/users");

router.route("/").get(getAllUsers);
router.route("/:id").get(getOneUser).patch(editUser).delete(deleteUser);

module.exports = router;
