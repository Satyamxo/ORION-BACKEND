const express = require("express");
const cors = require("cors");

const messageRoutes = require("./routes/messageRoutes");

const app = express();

// middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json());

// routes
app.use("/api/messages", messageRoutes);

// fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
