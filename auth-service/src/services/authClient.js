const UserProfile = require("../models/UserProfile");
const { fetchAuthUsers } = require("../services/authClient");

exports.getAllUsers = async (req, res) => {
  try {
    // 1️⃣ auth service se ALL users
    const authUsers = await fetchAuthUsers();

    // 2️⃣ local profiles
    const profiles = await UserProfile.find();

    // 3️⃣ profile map
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = p;
    });

    // 4️⃣ merge
    const users = authUsers.map(u => {
      const profile = profileMap[u._id] || {};

      return {
        _id: u._id,
        enrollment: u.enrollment,
        name: profile.name || u.name,
        avatar: profile.avatar || null,
        bio: profile.bio || ""
      };
    });

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};