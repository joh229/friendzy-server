// server/models/post.js

const mongoose = require("mongoose");

/* ================= REPLY SCHEMA ================= */
const replySchema = new mongoose.Schema(
{
userId: String,
username: String,
text: String,
likes: { type: [String], default: [] },
},
{ timestamps: true }
);

/* ================= COMMENT SCHEMA ================= */
const commentSchema = new mongoose.Schema(
{
userId: String,
username: String,
text: String,
likes: { type: [String], default: [] },
replies: [replySchema],
},
{ timestamps: true }
);

/* ================= POST SCHEMA ================= */
const postSchema = new mongoose.Schema(
{
userId: { type: String, required: true },
username: { type: String, required: true },

content: { type: String, default: "" },  

image: {  
  url: { type: String, default: "" },  
  public_id: { type: String, default: "" },  
},  

// 🎵 MUSIC SUPPORT  
music: {  
  title: { type: String, default: "" },  
  artist: { type: String, default: "" },  
  url: { type: String, default: "" }, // spotify/youtube link  
},  

// 🏷 TAG PEOPLE SUPPORT  
tags: {  
  type: [String], // userIds or usernames  
  default: [],  
},  

likes: {  
  type: [String], // userIds  
  default: [],  
},  

comments: [commentSchema],

},
{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);