// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");
// const {
//   getPendingUsers,
//   approveUser,
//   rejectUser
// } = require("../controllers/adminController");

// // Admin only
// router.use(authMiddleware);
// router.use(adminMiddleware);

// // GET pending users
// router.get("/pending-users", getPendingUsers);

// // Approve user
// router.post("/approve/:userId", approveUser);

// // Reject user
// router.post("/reject/:userId", rejectUser);




// module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers ,
  blockUser,        // ✅ NEW
  unblockUser       // ✅ NEW
} = require("../controllers/adminController");

// 🔒 Apply middlewares to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Existing routes
router.get("/pending-users", getPendingUsers);
router.get("/users", getAllUsers);
router.post("/approve/:userId", approveUser);
router.post("/reject/:userId", rejectUser);

// 🔥 NEW: Block user
router.post("/block/:userId", blockUser);

// 🔥 NEW: Unblock user
router.post("/unblock/:userId", unblockUser);

module.exports = router;