/*jshint esversion: 8*/
const express = require("express");
const router = express.Router();
const { getOneComment, addComment } = require("../controllers/comment");

router.route("/:id").get(getOneComment).patch(addComment);

module.exports = router;
