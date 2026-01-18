// server/controllers/authController.js

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const cloudinary = require("../configs/cloudinary");

/* ======================================================
   REGISTER
====================================================== */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      followers: [],
      following: [],
      bio: "",
      profilePic: {
        url: "https://res.cloudinary.com/demo/image/upload/v1690000000/default-avatar.png",
        public_id: "",
      },
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Registration successful",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   LOGIN
====================================================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   GET PROFILE  ✅ FIXED
====================================================== */
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ⚠️ Return user directly, not wrapped
    res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   UPDATE PROFILE  ✅ FIXED & STABLE
====================================================== */
exports.updateProfile = async (req, res) => {
  try {
    const { userId, username, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username !== undefined) user.username = username.trim();
    if (bio !== undefined) user.bio = bio.trim();

    if (req.file) {
      // Remove old image
      if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      }

      // Save new image
      user.profilePic = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   FOLLOW USER
====================================================== */
exports.followUser = async (req, res) => {
  try {
    const { userId, targetId } = req.body;

    if (userId === targetId) {
      return res.json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.following.some(id => id.toString() === targetId)) {
      user.following.push(targetId);
      targetUser.followers.push(userId);

      await user.save();
      await targetUser.save();
    }

    res.json({ success: true, message: "Followed successfully" });
  } catch (err) {
    console.error("FOLLOW ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   UNFOLLOW USER
====================================================== */
exports.unfollowUser = async (req, res) => {
  try {
    const { userId, targetId } = req.body;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.following = user.following.filter((id) => id !== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id !== userId);

    await user.save();
    await targetUser.save();

    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    console.error("UNFOLLOW ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};