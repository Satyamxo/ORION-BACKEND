const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getMyProfile,
  upsertMyProfile,
  getUserProfile,
  getUserById
} = require("../controllers/userController");

// ✅ chat user list
router.get("/", authMiddleware, getAllUsers);

// ✅ my profile (MUST be above :id)
router.get("/me", authMiddleware, getMyProfile);
router.post("/me", authMiddleware, upsertMyProfile);
router.get("/:userId/profile", authMiddleware, getUserProfile);
// ✅ public user profile by auth-userId
router.get("/:id", authMiddleware, getUserById);

module.exports = router;
