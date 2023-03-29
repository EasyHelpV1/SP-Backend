const express = require("express");
const router = express.Router();
const { ResetUserPassword } = require("../controllers/adminActions");

router.route("/ResetUserPassword").patch(ResetUserPassword);

module.exports = router;
