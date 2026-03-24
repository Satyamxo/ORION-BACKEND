const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  approveUser,
  resetPassword,
  forgotPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @route   GET /api/auth/health
 * @desc    Auth service health check
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({ status: "auth-service running" });
});

/**
 * @route   POST /api/auth/signup
 * @desc    Signup request (approval required)
 * @access  Public
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login (approved users only)
 * @access  Public
 */
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
/**
 * @route   PATCH /api/auth/approve
 * @desc    Approve user (admin only)
 * @access  Private (admin)
 */
router.patch(
  "/approve",
  authMiddleware,
  adminMiddleware,
  approveUser
);

module.exports = router;
