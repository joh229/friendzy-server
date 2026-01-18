// server/configs/upload.js

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "others";

    if (file.fieldname === "image") {
      folder = "posts";
    }

    if (file.fieldname === "profilePic") {
      folder = "profiles";
    }

    return {
      folder: folder,
      resource_type: "auto",   // 🔥 allow images + videos automatically
      allowed_formats: [
        "jpg", "jpeg", "png", "webp",
        "mp4", "mov", "avi", "mkv", "webm"
      ],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,   // 🔥 50MB for videos
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      // Images
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",

      // Videos
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
    ];

    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only images and videos are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;