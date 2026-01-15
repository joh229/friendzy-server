// server/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🖼 Profile Picture (Cloudinary)
    profilePic: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/demo/image/upload/v1690000000/default-avatar.png",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    // 📝 Bio / About
    bio: {
      type: String,
      default: "",
      maxlength: 150,
      trim: true,
    },

    // 📍 Optional location
    location: {
      type: String,
      default: "",
      maxlength: 50,
    },

    // 🔗 Optional website / social link
    website: {
      type: String,
      default: "",
    },

    followers: {
      type: [String], // userIds
      default: [],
    },

    following: {
      type: [String], // userIds
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

/*
  Prevents:
  OverwriteModelError: Cannot overwrite 'User' model once compiled
*/
module.exports = mongoose.models.User || mongoose.model("User", userSchema);