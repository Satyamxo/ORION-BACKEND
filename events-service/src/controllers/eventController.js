const Event = require("../models/Event");
const { mailTransporter } = require("../config/mail");
const axios = require("axios");

/**
 * CREATE EVENT
 */
const createEvent = async (req, res) => {
  try {
    const { userId, name } = req.user;
    const { title, description, imageUrl, eventType } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const event = await Event.create({
      title,
      description,
      creatorName: name,
      imageUrl: imageUrl || null,
      eventType: eventType || "announcement",
      createdBy: userId
    });

    res.status(201).json(event);

    /* 🔔 EMAIL (NON BLOCKING) */
    try {
      const authRes = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/internal/user-emails`
      );

      const recipients = authRes.data.filter(
        (u) => u.userId !== userId
      );

      for (const u of recipients) {
        await mailTransporter.sendMail({
          from: `"ORION Alerts" <${process.env.MAIL_USER}>`,
          to: u.email,
          subject: `📢 New Event: ${title}`,
          html: `
            <h2>${title}</h2>
            <p>${description}</p>
            <p><b>Posted by:</b> ${name}</p>
            ${
              imageUrl
                ? `<img src="${imageUrl}" style="max-width:100%" />`
                : ""
            }
            <p>
              <a href="${process.env.FRONTEND_URL}/events">View Event</a>
            </p>
          `
        });
      }
    } catch (e) {
      console.error("Email failed:", e.message);
    }

  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET ALL EVENTS
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * RESPOND TO EVENT ✅ FINAL FIX
 */
const respondToEvent = async (req, res) => {
  try {
    let { userId, name, enrollment } = req.user;
    const { response } = req.body;
    const eventId = req.params.id;

    if (!["congrats", "interested", "noted"].includes(response)) {
      return res.status(400).json({ message: "Invalid response" });
    }

   
    if (!name || !enrollment) {
      const authRes = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/internal/users/${userId}`
      );

      name = authRes.data.name;
      enrollment = authRes.data.enrollment;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // remove old response
    event.responses = event.responses.filter(
      (r) => r.userId.toString() !== userId
    );

    // add new response
    event.responses.push({
      userId,
      name,
      enrollment,
      response
    });

    await event.save();

    res.json({
      message: "Response recorded",
      responses: event.responses
    });

  } catch (error) {
    console.error("Respond event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * GET EVENT BY ID (WITH RESPONSES)
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Get event error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  respondToEvent,
  getEventById
};