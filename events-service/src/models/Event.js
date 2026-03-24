const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    enrollment: {
      type: String,
      required: true
    },
    response: {
      type: String,
      enum: ["congrats", "interested", "noted"],
      required: true
    }
  },
  { _id: false }
);
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String,
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
creatorName: {
  type: String,
  required: true
},
    eventType: {
      type: String,
      enum: ["marriage", "achievement", "announcement", "other"],
      default: "announcement"
    },

    responses: {
      type: [responseSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);
