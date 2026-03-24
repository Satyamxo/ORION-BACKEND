const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Global middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
// 🔥 add this
const internalRoutes = require("./routes/internal");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/internal",authMiddleware, internalRoutes);
// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
