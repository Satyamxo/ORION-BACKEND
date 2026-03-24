const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  respondToEvent,
  getEventById,
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   POST /api/events
 * @desc    Create new event (announcement)
 * @access  Private
 */
router.post("/", authMiddleware, createEvent);

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Private
 */
router.get("/", authMiddleware, getAllEvents);
// router.get("/:id/responses", authMiddleware, getEventResponses);
router.get("/:id", authMiddleware, getEventById);
/**
 * @route   POST /api/events/:id/respond
 * @desc    Respond to an event
 * @access  Private
 */
router.post("/:id/respond", authMiddleware, respondToEvent);

module.exports = router;
