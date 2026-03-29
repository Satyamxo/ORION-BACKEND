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

router.get("/health", (req, res) => {
  res.json({ status: "auth-service running" });
});


router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch(
  "/approve",
  authMiddleware,
  adminMiddleware,
  approveUser
);

module.exports = router;
