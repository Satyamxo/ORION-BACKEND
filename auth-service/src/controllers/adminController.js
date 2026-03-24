const User = require("../models/User");

// ✅ GET pending users (approved = false)
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false }).select(
      "enrollment role approved createdAt"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

// ✅ APPROVE user (approved = true)
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, {
      approved: true
    });

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // 🔥 important (password hide)
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 🔥 FORCE LOGOUT (FIXED)
    if (global.io) {
      global.io.to(user._id.toString()).emit("forceLogout", {
        message: "You are blocked by admin"
      });
    }

    res.json({
      message: "User blocked successfully",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// 🟢 UNBLOCK USER
exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User unblocked successfully",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// ✅ REJECT user (delete user)
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({ message: "User rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject user" });
  }
};
