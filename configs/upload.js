// server/configs/upload.js

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

/*
  We use one upload system for:
  1. Post images  -> folder: posts
  2. Profile pics -> folder: profiles

  The folder is selected dynamically based on the field name:
  - image       → posts
  - profilePic  → profiles
*/

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
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only JPG, PNG, JPEG, WEBP images are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;