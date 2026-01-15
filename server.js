// server/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load .env from server folder
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// Routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");

const app = express();

/* ================= Middleware ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILE SERVING (VERY IMPORTANT) ================= */
// This makes uploaded images accessible from browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= Routes ================= */
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

/* ================= Debug ================= */
console.log("MONGODB_URI =", process.env.MONGODB_URI);

/* ================= Stop if env not loaded ================= */
if (!process.env.MONGODB_URI) {
  console.error("ENV FILE NOT LOADED. MONGODB_URI is missing.");
  process.exit(1);
}

/* ================= MongoDB Connection ================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= Start Server ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});