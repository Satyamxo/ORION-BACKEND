const Message = require("../models/Message");

/**
 * @desc Get private chat history with a user
 * @route GET /api/messages/private/:userId
 */
exports.getPrivateMessages = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      messageType: "private",
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get private messages error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch messages" });
  }
};
exports.getConversations = async (req, res) => {
  try {
    const myId = req.user.userId;

    const messages = await Message.find({
      messageType: "private",
      $or: [{ senderId: myId }, { receiverId: myId }]
    }).sort({ createdAt: -1 });

    const map = new Map();

    messages.forEach((m) => {
      const otherUser =
        m.senderId.toString() === myId
          ? m.receiverId.toString()
          : m.senderId.toString();

      if (!map.has(otherUser)) {
        map.set(otherUser, {
          userId: otherUser,
          lastMessage: m.content || "📷 Image",
          lastMessageAt: m.createdAt,
          senderName: m.senderName,
          senderAvatar: m.senderAvatar,
          unreadCount:
            m.receiverId?.toString() === myId &&
              !m.readBy.includes(myId)
              ? 1
              : 0
        });
      } else {
        const convo = map.get(otherUser);
        if (
          m.receiverId?.toString() === myId &&
          !m.readBy.includes(myId)
        ) {
          convo.unreadCount += 1;
        }
      }
    });

    res.json([...map.values()]);
  } catch (err) {
    console.error("Get conversations error", err);
    res.status(500).json({ message: "Failed to load chats" });
  }
};
/**
 * @desc Get CLASS_GROUP chat history
 * @route GET /api/messages/group/class
 */
exports.getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      messageType: "group"
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get group messages error:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};
exports.markPrivateMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: myId,
        readBy: { $ne: myId }
      },
      {
        $push: { readBy: myId }
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

exports.getPrivateChatSummary = async (req, res) => {
  try {
    const myId = req.user.userId;

    const messages = await Message.find({
      messageType: "private",
      $or: [
        { senderId: myId },
        { receiverId: myId }
      ]
    }).sort({ createdAt: -1 });

    const chatMap = {};

    for (const msg of messages) {
      const otherUserId =
        msg.senderId.toString() === myId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!chatMap[otherUserId]) {
        chatMap[otherUserId] = {
          userId: otherUserId,
          lastMessage: msg.content || "📷 Image",
          lastMessageTime: msg.createdAt,
          senderName: msg.senderName,
          senderAvatar: msg.senderAvatar,
          unreadCount: 0
        };
      }

      // count unread messages
      if (
        msg.receiverId?.toString() === myId &&
        !msg.readBy?.includes(myId)
      ) {
        chatMap[otherUserId].unreadCount += 1;
      }
    }

    res.json(Object.values(chatMap));
  } catch (err) {
    console.error("Private summary error:", err);
    res.status(500).json({ message: "Failed to load chat summary" });
  }
};