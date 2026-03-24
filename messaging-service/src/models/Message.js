const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    // 🔥 DENORMALIZED USER DATA (VERY IMPORTANT)
    senderName: {
      type: String,
      
    },

    senderAvatar: {
      type: String,
      default: null
    },

    // for 1-to-1 chat
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    // for group chat
    groupId: {
      type: String,
      default: null
    },

    // text message
    content: {
      type: String,
      trim: true,
      default: ""
    },

    // image message
    imageUrl: {
      type: String,
      default: null
    },

    messageType: {
      type: String,
      enum: ["private", "group"],
      required: true
    },

    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);