const express = require("express");
const router = express.Router();
const {
  ResetUserPassword,
  deleteUser,
  deletePost,
  findUser,
  editUser,
} = require("../controllers/adminActions");

router.route("/ResetUserPassword").patch(ResetUserPassword);
router.route("/DeleteUser/:email").delete(deleteUser);
router.route("/DeletePost").delete(deletePost);
router.route("/FindUser/:email").get(findUser);
router.route("/EditUser/:email").patch(editUser);

module.exports = router;
