const express = require("express");
const router = express.Router();
const { register, login, confirm } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/confirm/:email/:token").get(confirm);

module.exports = router;
