const axios = require("axios");
const UserProfile = require("../models/UserProfile");


exports.getAllUsers = async (req, res) => {
  try {
   
    const authRes = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/internal/users`
    );

    const authUsers = authRes.data; 
    // [{ _id, enrollment, name, email }]

    // 🔹 2. Fetch profiles created till now
    const profiles = await UserProfile.find();

    // 🔹 3. Merge users + profiles
    const mergedUsers = authUsers.map((u) => {
      const profile = profiles.find(
        (p) => p.userId.toString() === u._id
      );

      return {
        userId: u._id,
        enrollment: u.enrollment,
        name: profile?.name || u.name,
        avatar: profile?.avatar || null,
        bio: profile?.bio || ""
      };
    });

    res.json(mergedUsers);
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ fetch user from AUTH SERVICE
    const authRes = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/internal/users/${userId}`
    );

    const authUser = authRes.data;
    // { _id, enrollment, name, email }

    // 2️⃣ fetch profile (may or may not exist)
    const profile = await UserProfile.findOne({ userId });

    // 3️⃣ merge
    res.json({
      userId,
      enrollment: authUser.enrollment,
      name: authUser.name,
      avatar: profile?.avatar || null,
      bio: profile?.bio || ""
    });

  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Failed to load profile" });
  }
};
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.user.userId
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * @desc    Create or update logged-in user's profile
 * @route   POST /api/users/me
 * @access  Private
 */
exports.upsertMyProfile = async (req, res) => {
  try {
    const { name, avatar,bio } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        userId: req.user.userId,
        enrollment: req.user.enrollment,
        name,
        avatar,
        bio
      },
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
/**
 * @desc    Get user profile by userId (public profile)
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await UserProfile.findOne({
      userId
    }).select("name avatar bio enrollment");

    // 🔹 If profile not created yet → return safe fallback
    if (!profile) {
      return res.json({
        name: "User",
        enrollment: "",
        avatar: null,
        bio: ""
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("Get user by id error:", err);
    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};
