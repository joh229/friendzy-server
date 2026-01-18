const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    media: {
      url: String,
      public_id: String,
      resource_type: String, // image or video
    },

    // Users who liked the story
    likes: {
      type: [String], // array of userIds
      default: [],
    },

    // Users who viewed the story
    views: {
      type: [String], // array of userIds
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24, // auto delete after 24 hours
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);