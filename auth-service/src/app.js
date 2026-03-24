
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const internalRoutes = require("./routes/internal.routes");

const app = express();

// Global middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json());

// Public / protected auth routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/admin", adminRoutes);

// 🔒 INTERNAL routes (ONLY for other services)
app.use("/internal", internalRoutes);
app.use("/api/auth/internal", internalRoutes);
// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;