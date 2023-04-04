const express = require("express");
const router = express.Router();
const {
  ResetUserPassword,
  deleteUser,
  deletePost,
  findUser,
  editUser,
  addAdmin,
  removeAdmin,
} = require("../controllers/adminActions");

router.route("/ResetUserPassword").patch(ResetUserPassword);
router.route("/DeleteUser/:email").delete(deleteUser);
router.route("/DeletePost").delete(deletePost);
router.route("/FindUser/:email").get(findUser);
router.route("/EditUser/:email").patch(editUser);
router.route("/AddAdmin/:email").patch(addAdmin);
router.route("/RemoveAdmin/:email").patch(removeAdmin);

module.exports = router;
