const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupId: {
      type: String,
      required: true,
      unique: true
      // example: "CLASS_GROUP"
    },

    name: {
      type: String,
      required: true
      // example: "Batch SC23 CS - Class Group"
    },

    members: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
      // userIds of all students
    },

    isDefault: {
      type: Boolean,
      default: false
      // true for CLASS_GROUP
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Group", groupSchema);
