const express = require("express");
const {
  getAllPosts,
  createPost,
  editPost,
  deletePost,
} = require("../controllers/post");
const passport = require("passport");
const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });

router.get("/", auth, getAllPosts);

router.post("/", auth, createPost);

router.put("/:id", auth, editPost);

router.delete("/:id", auth, deletePost);

module.exports = router;
