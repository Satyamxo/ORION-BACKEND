const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/httpAuth");
const {
  getPrivateMessages,
  getGroupMessages,
  getConversations,
  getPrivateChatSummary,
  markPrivateMessagesAsRead
} = require("../controllers/messageController");

/**
 * PRIVATE CHAT
 */

router.get(
  "/private/summary",
  authMiddleware,
  getPrivateChatSummary
);
router.get(
  "/private/:userId",
  authMiddleware,
  getPrivateMessages
);
router.get(
  "/conversations",
  authMiddleware,
  getConversations
);
router.patch(
  "/private/read/:userId",
  authMiddleware,
  markPrivateMessagesAsRead
);
/**
 * CLASS GROUP CHAT
 */
router.get(
  "/group/class",
  authMiddleware,
  getGroupMessages
);

module.exports = router;