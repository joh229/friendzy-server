const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* ================= FOLLOW USER ================= */
router.post("/follow", async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.following.includes(targetId)) {
      user.following.push(targetId);
      targetUser.followers.push(userId);

      await user.save();
      await targetUser.save();
    }

    res.json({
      success: true,
      message: "Followed successfully",
      following: user.following,
    });

  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ================= UNFOLLOW USER ================= */
router.post("/unfollow", async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.following = user.following.filter(id => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    res.json({
      success: true,
      message: "Unfollowed successfully",
      following: user.following,
    });

  } catch (err) {
    console.error("UNFOLLOW ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;