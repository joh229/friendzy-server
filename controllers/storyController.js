const Story = require("../models/Story");

/* ================= CREATE STORY ================= */
exports.createStory = async (req, res) => {
  try {
    const { userId, username } = req.body;

    if (!userId || !username || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Missing userId, username or file",
      });
    }

    const media = {
      url: req.file.path,
      public_id: req.file.filename,
      resource_type: req.file.resource_type,
    };

    const story = new Story({
      userId,
      username,
      media,
    });

    await story.save();

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (err) {
    console.error("CREATE STORY ERROR:", err);
    res.status(500).json({ success: false, error: "Story upload failed" });
  }
};

/* ================= GET ALL STORIES ================= */
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, stories });
  } catch (err) {
    console.error("GET STORIES ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to fetch stories" });
  }
};

/* ================= LIKE / UNLIKE STORY ================= */
exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.likes.includes(userId)) {
      story.likes = story.likes.filter((u) => u !== userId); // unlike
    } else {
      story.likes.push(userId); // like
    }

    await story.save();
    res.status(200).json({ success: true, likes: story.likes });
  } catch (err) {
    console.error("LIKE STORY ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to like story" });
  }
};

/* ================= ADD VIEW ================= */
exports.addView = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (!story.views.includes(userId)) {
      story.views.push(userId);
      await story.save();
    }

    res.status(200).json({ success: true, views: story.views.length });
  } catch (err) {
    console.error("VIEW STORY ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to add view" });
  }
};

/* ================= DELETE STORY ================= */
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    await Story.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (err) {
    console.error("DELETE STORY ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to delete story" });
  }
};