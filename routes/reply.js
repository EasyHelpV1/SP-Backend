/*jshint esversion: 8*/
const express = require("express");
const router = express.Router();
const { getOneReply, addReply } = require("../controllers/reply");

router.route("/:id").get(getOneReply).patch(addReply);

module.exports = router;
