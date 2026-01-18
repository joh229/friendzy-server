// server/controllers/postController.js

const Post = require("../models/post");
const cloudinary = require("../configs/cloudinary");

console.log("POST CONTROLLER LOADED");

/* ================= CREATE POST ================= */
exports.createPost = async (req, res) => {
try {
const { userId, username, content, music, tags } = req.body;

if (!userId || !username) {  
  return res.status(400).json({  
    success: false,  
    message: "User data missing",  
  });  
}  

 
let image = null;

if (req.file) {
  image = {
    url: req.file.path,
    public_id: req.file.filename,
    resource_type: req.file.resource_type, // 🔥 REQUIRED FOR VIDEO
  };
}

const post = new Post({  
  userId: String(userId),  
  username,  
  content: content || "",  
  image,  
  music: music ? JSON.parse(music) : { title: "", artist: "", url: "" },  
  tags: tags ? JSON.parse(tags) : [],  
  likes: [],  
  comments: [],  
});  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("CREATE POST ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= GET ALL POSTS ================= */
exports.getAllPosts = async (req, res) => {
try {
const posts = await Post.find().sort({ createdAt: -1 });
res.json({
success: true,
posts,
});
} catch (err) {
console.error("GET POSTS ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= GET SINGLE POST ================= */
exports.getSinglePost = async (req, res) => {
try {
const post = await Post.findById(req.params.id);

if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("GET SINGLE POST ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= UPDATE POST ================= */
exports.updatePost = async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) {
return res.status(404).json({
success: false,
message: "Post not found",
});
}

const { content, music, tags } = req.body;  

if (content !== undefined) post.content = content;  
if (music) post.music = JSON.parse(music);  
if (tags) post.tags = JSON.parse(tags);  

if (req.file) {  
  if (post.image.public_id) {  
    await cloudinary.uploader.destroy(post.image.public_id);  
  }  

  post.image = {  
    url: req.file.path,  
    public_id: req.file.filename,  
  };  
}  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("UPDATE POST ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= DELETE POST ================= */
exports.deletePost = async (req, res) => {
try {
const post = await Post.findById(req.params.id);

if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

if (post.image.public_id) {  
  await cloudinary.uploader.destroy(post.image.public_id);  
}  

await Post.findByIdAndDelete(req.params.id);  

res.json({  
  success: true,  
  message: "Post deleted",  
});

} catch (err) {
console.error("DELETE POST ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= LIKE / UNLIKE POST ================= */
exports.likePost = async (req, res) => {
try {
const { userId } = req.body;
const post = await Post.findById(req.params.id);

if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

if (post.likes.includes(userId)) {  
  post.likes.pull(userId);  
} else {  
  post.likes.push(userId);  
}  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("LIKE POST ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= ADD COMMENT ================= */
exports.addComment = async (req, res) => {
try {
const { userId, username, text } = req.body;
const post = await Post.findById(req.params.id);

if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

post.comments.push({  
  userId,  
  username,  
  text,  
  likes: [],  
  replies: [],  
});  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("ADD COMMENT ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= DELETE COMMENT ================= */
exports.deleteComment = async (req, res) => {
try {
const { postId, commentId } = req.params;
const post = await Post.findById(postId);

if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

post.comments = post.comments.filter(  
  (c) => c._id.toString() !== commentId  
);  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("DELETE COMMENT ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= LIKE / UNLIKE COMMENT ================= */
exports.likeComment = async (req, res) => {
try {
const { userId } = req.body;
const { postId, commentId } = req.params;

const post = await Post.findById(postId);  
if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

const comment = post.comments.id(commentId);  
if (!comment) {  
  return res.status(404).json({  
    success: false,  
    message: "Comment not found",  
  });  
}  

if (comment.likes.includes(userId)) {  
  comment.likes.pull(userId);  
} else {  
  comment.likes.push(userId);  
}  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("LIKE COMMENT ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= ADD REPLY ================= */
exports.addReply = async (req, res) => {
try {
const { userId, username, text } = req.body;
const { postId, commentId } = req.params;

const post = await Post.findById(postId);  
if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

const comment = post.comments.id(commentId);  
if (!comment) {  
  return res.status(404).json({  
    success: false,  
    message: "Comment not found",  
  });  
}  

comment.replies.push({  
  userId,  
  username,  
  text,  
  likes: [],  
});  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("ADD REPLY ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= LIKE / UNLIKE REPLY ================= */
exports.likeReply = async (req, res) => {
try {
const { userId } = req.body;
const { postId, commentId, replyId } = req.params;

const post = await Post.findById(postId);  
if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

const comment = post.comments.id(commentId);  
if (!comment) {  
  return res.status(404).json({  
    success: false,  
    message: "Comment not found",  
  });  
}  

const reply = comment.replies.id(replyId);  
if (!reply) {  
  return res.status(404).json({  
    success: false,  
    message: "Reply not found",  
  });  
}  

if (reply.likes.includes(userId)) {  
  reply.likes.pull(userId);  
} else {  
  reply.likes.push(userId);  
}  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("LIKE REPLY ERROR:", err);
res.status(500).json({
success: false,
message: err.message,
});
}
};

/* ================= DELETE REPLY ================= */
exports.deleteReply = async (req, res) => {
try {
const { postId, commentId, replyId } = req.params;

const post = await Post.findById(postId);  
if (!post) {  
  return res.status(404).json({  
    success: false,  
    message: "Post not found",  
  });  
}  

const comment = post.comments.id(commentId);  
if (!comment) {  
  return res.status(404).json({  
    success: false,  
    message: "Comment not found",  
  });  
}  

comment.replies = comment.replies.filter(  
  (r) => r._id.toString() !== replyId  
);  

await post.save();  

res.json({  
  success: true,  
  post,  
});

} catch (err) {
console.error("DELETE REPLY ERROR:", err);
res.status(500).json({
success: false,
message: err.message || "Failed to delete reply",
});
}
};

