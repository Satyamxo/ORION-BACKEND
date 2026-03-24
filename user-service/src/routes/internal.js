// user-service/src/routes/internal.js
const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");

// 🔒 INTERNAL ROUTE (no auth, trusted service only)
router.get("/users/:userId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.params.userId
    });

    return res.json({
      userId: req.params.userId,
      name: profile?.name || "User",
      avatar: profile?.avatar || null
    });
  } catch (err) {
    console.error("Internal user fetch error:", err.message);
    res.status(500).json({ message: "Internal user fetch failed" });
  }
});

module.exports = router;