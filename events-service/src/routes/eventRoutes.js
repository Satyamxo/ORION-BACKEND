const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  respondToEvent,
  getEventById,
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createEvent);

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Private
 */
router.get("/", authMiddleware, getAllEvents);
// router.get("/:id/responses", authMiddleware, getEventResponses);
router.get("/:id", authMiddleware, getEventById);

router.post("/:id/respond", authMiddleware, respondToEvent);

module.exports = router;
