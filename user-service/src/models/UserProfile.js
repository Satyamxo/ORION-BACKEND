const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },

    enrollment: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
