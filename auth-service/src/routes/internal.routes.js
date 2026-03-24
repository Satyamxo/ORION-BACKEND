const express = require("express");
const router = express.Router();
const User = require("../models/User");




// 🔒 INTERNAL USE ONLY
router.get("/users", async (req, res) => {
  const users = await User.find(
    { approved: true },
    "_id enrollment name email"
  );
  res.json(users);
});

router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "_id enrollment name email"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});


router.get("/user-emails", async (req, res) => {
  try {
    const users = await User.find(
      { approved: true },
      "email name _id"
    );

    const result = users.map((u) => ({
      userId: u._id.toString(),
      email: u.email,
      name: u.name
    }));

    res.json(result);
  } catch (err) {
    console.error("Internal user-emails error:", err);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});

module.exports = router;


