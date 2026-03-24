const express = require("express");
const cors = require("cors");
const mediaRoutes = require("./routes/media.routes");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use("/api/media", mediaRoutes);

module.exports = app;
