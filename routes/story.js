const express = require("express");
const router = express.Router();
const upload = require("../configs/upload");
const storyController = require("../controllers/storyController");

/*
===============================
 STORY ROUTES
 Base URL: /api/stories
===============================
*/

// Upload story (image or video)
router.post(
  "/create",
  upload.single("image"),
  storyController.createStory
);

// Get all stories
router.get("/", storyController.getStories);

// Like / Unlike story
router.put("/like/:id", storyController.likeStory);

// Add view to story
router.put("/view/:id", storyController.addView);

// Delete story
router.delete("/delete/:id", storyController.deleteStory);

module.exports = router;