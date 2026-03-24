
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Global middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);

// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
