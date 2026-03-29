import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Health check
app.get("/", (req, res) => {
  res.send("Gateway working 🚀")
})

/**
 * AUTH SERVICE
 */
app.use("/auth", createProxyMiddleware({
  target: process.env.AUTH_URL,
  changeOrigin: true,
  pathRewrite: { "^/auth": "/api/auth" }
}))

/**
 * USER SERVICE
 */
app.use("/user", createProxyMiddleware({
  target: process.env.USER_URL,
  changeOrigin: true,
  pathRewrite: { "^/user": "/api/user" }
}))

/**
 * MESSAGING SERVICE (Socket + APIs)
 */
app.use("/chat", createProxyMiddleware({
  target: process.env.CHAT_URL,
  changeOrigin: true,
  ws: true, // IMPORTANT for socket
  pathRewrite: { "^/chat": "" }
}))

/**
 * EVENTS SERVICE
 */
app.use("/events", createProxyMiddleware({
  target: process.env.EVENTS_URL,
  changeOrigin: true,
  pathRewrite: { "^/events": "" }
}))

/**
 * MEDIA SERVICE
 */
app.use("/media", createProxyMiddleware({
  target: process.env.MEDIA_URL,
  changeOrigin: true,
  pathRewrite: { "^/media": "" }
}))

// PORT (Render compatible)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`)
})