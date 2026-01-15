// server/routes/post.js

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../configs/upload");

/*
================================================
 POST ROUTES
 Base URL: /api/posts
================================================
*/

/* ================= CREATE POST ================= */
router.post(
  "/create",
  upload.single("image"),
  postController.createPost
);

/* ================= GET ALL POSTS ================= */
router.get("/", postController.getAllPosts);

/* ================= GET SINGLE POST ================= */
router.get("/:id", postController.getSinglePost);

/* ================= UPDATE POST ================= */
router.put(
  "/update/:id",
  upload.single("image"),
  postController.updatePost
);

/* ================= DELETE POST ================= */
router.delete("/delete/:id", postController.deletePost);

/* ================= LIKE / UNLIKE POST ================= */
router.put("/like/:id", postController.likePost);

/* ================= ADD COMMENT ================= */
router.post("/comment/:id", postController.addComment);

/* ================= DELETE COMMENT ================= */
router.delete(
  "/comment/:postId/:commentId",
  postController.deleteComment
);

/* ================= LIKE / UNLIKE COMMENT ================= */
router.put(
  "/comment/like/:postId/:commentId",
  postController.likeComment
);

/* ================= ADD REPLY ================= */
router.post(
  "/reply/:postId/:commentId",
  postController.addReply
);

/* ================= LIKE / UNLIKE REPLY ================= */
router.put(
  "/reply/like/:postId/:commentId/:replyId",
  postController.likeReply
);

/* ================= DELETE REPLY ================= */
router.delete(
  "/reply/delete/:postId/:commentId/:replyId",
  postController.deleteReply
);

module.exports = router;