const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getOnePost,
  editPost,
  deletePost,
  createPost,
} = require("../controllers/posts");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getOnePost).patch(editPost).delete(deletePost);

module.exports = router;
