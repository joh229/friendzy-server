// server/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../configs/upload");

/*
================================================
 AUTH ROUTES
 Base URL: /api/auth
================================================
*/

/* ================= TEST ROUTE ================= */
router.get("/", (req, res) => {
  res.json({ success: true, message: "Auth route working" });
});

/* ================= REGISTER ================= */
router.post("/register", authController.register);

/* ================= LOGIN ================= */
router.post("/login", authController.login);

/* ================= LOGOUT ================= */
/*
  Frontend only clears localStorage.
  Backend simply confirms logout.
*/
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

/* ================= GET USER PROFILE ================= */
/*
  Params:
  - id (userId)
*/
router.get("/profile/:id", authController.getProfile);

/* ================= UPDATE PROFILE ================= */
/*
  FormData:
  - userId (required)
  - username (optional)
  - bio (optional)
  - image (optional file)

  Uses:
  - Multer + Cloudinary
*/
router.put(
  "/update-profile",
  upload.single("image"),
  authController.updateProfile
);

/* ================= FOLLOW USER ================= */
/*
  Body:
  - userId
  - targetId
*/
router.post("/follow", authController.followUser);

/* ================= UNFOLLOW USER ================= */
/*
  Body:
  - userId
  - targetId
*/
router.post("/unfollow", authController.unfollowUser);

module.exports = router;