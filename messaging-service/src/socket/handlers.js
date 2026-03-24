
const Message = require("../models/Message");
const CLASS_GROUP_ID = "CLASS_GROUP";
const axios = require("axios")
require("dotenv").config(); // 🔥 MUST be at the TOP
const registerHandlers = (io, socket) => {
  const { userId } = socket.user;
  /* ================= SEND MESSAGE ================= */
  socket.on("send_message", async (payload) => {
    try {
      const { type, receiverId, content = "", imageUrl = null } = payload;
      if (!type || (!content && !imageUrl)) return;

      const baseData = {
        senderId: userId,
        senderName: socket.user.name ?? null,
        content,
        imageUrl,
        messageType: type,
        readBy: []
      };
      /* ========= PRIVATE CHAT ========= */
      if (type === "private") {
        if (!receiverId) return;

        const senderName =
          socket.user.name ??
          socket.user.enrollment ??
          `User-${userId.toString().slice(-4)}`;

        const senderAvatar = null; // ❗ frontend se handle hoga

        const message = await Message.create({
          senderId: userId,
          receiverId,
          senderName,
          senderAvatar, // null is OK
          content,
          imageUrl,
          messageType: "private",
          readBy: []
        });

        // 🔥 realtime chat
        io.to(receiverId).emit("new_message", message);
        io.to(userId).emit("new_message", message);

        // 🔥 chat list auto refresh (VERY IMPORTANT)
        io.to(receiverId).emit("chat_summary_update", {
          fromUserId: userId,
          lastMessage: content || "📷 Image",
          lastMessageAt: message.createdAt,
          unreadIncrement: 1
        });

        return;
      }

      /* ========= GROUP CHAT ========= */
      if (type === "group") {
       let senderName = `User-${socket.user.userId.toString().slice(-4)}`;
       try {
         const res = await axios.get(`${process.env.AUTH_SERVICE_URL}/internal/users/${userId}`)
         
          
  if (res?.data?.name) {
    senderName = res.data.name;
  }
} catch (err) {
  console.error("User service fetch failed:", err.message);
   
}
        const senderAvatar = null; // ❗ frontend se fetch hoga

        const message = await Message.create({
          senderId: socket.user.userId,
          senderName,        // ✅ always defined
          senderAvatar,      // ✅ null is OK
          content,
          imageUrl,
          messageType: "group",
          groupId: CLASS_GROUP_ID,
          readBy: []
        });

        io.to(CLASS_GROUP_ID).emit("new_group_message", message);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  });

  /* ================= READ MESSAGE ================= */
  socket.on("read_message", async ({ messageId }) => {
    try {

      const message = await Message.findById(messageId);
      if (!message) return;

      // ❌ sender should NEVER mark own message as read
      if (message.senderId.toString() === userId) return;

      if (message.readBy.includes(userId)) return;

      message.readBy.push(userId);
      await message.save();

      if (message.messageType === "private") {
        io.to(message.senderId.toString()).emit("message_read", {
          messageId,
          readBy: message.readBy
        });
      }

      if (message.messageType === "group") {
        io.to(message.groupId).emit("message_read", {
          messageId,
          readBy: message.readBy
        });
      }
    } catch (err) {
      console.error("Read message error:", err);
    }
  });
};

module.exports = registerHandlers;