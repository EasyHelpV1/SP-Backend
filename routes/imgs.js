const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getOneImg,
  createImg,
  deleteImg,
  changeImg,
} = require("../controllers/imgs");

// Set up multer middleware to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(upload.single("image"), createImg);
router.route("/:id").get(getOneImg).delete(deleteImg).patch(changeImg);

module.exports = router;
