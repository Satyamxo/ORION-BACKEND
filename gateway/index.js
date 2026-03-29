import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url)
  next()
})

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
  secure: false, // 🔥 IMPORTANT FIX
  pathRewrite: { "^/auth": "/api/auth" },
  onError: (err, req, res) => {
    console.error("Auth proxy error:", err.message)
    res.status(500).send("Auth service error")
  }
}))

/**
 * USER SERVICE
 */
app.use("/user", createProxyMiddleware({
  target: process.env.USER_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: { "^/user": "/api/user" },
  onError: (err, req, res) => {
    console.error("User proxy error:", err.message)
    res.status(500).send("User service error")
  }
}))

/**
 * MESSAGING SERVICE
 */
app.use("/chat", createProxyMiddleware({
  target: process.env.CHAT_URL,
  changeOrigin: true,
  secure: false,
  ws: true,
  pathRewrite: { "^/chat": "" },
  onError: (err, req, res) => {
    console.error("Chat proxy error:", err.message)
    res.status(500).send("Chat service error")
  }
}))

/**
 * EVENTS SERVICE
 */
app.use("/events", createProxyMiddleware({
  target: process.env.EVENTS_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: { "^/events": "" },
  onError: (err, req, res) => {
    console.error("Events proxy error:", err.message)
    res.status(500).send("Events service error")
  }
}))

/**
 * MEDIA SERVICE
 */
app.use("/media", createProxyMiddleware({
  target: process.env.MEDIA_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: { "^/media": "" },
  onError: (err, req, res) => {
    console.error("Media proxy error:", err.message)
    res.status(500).send("Media service error")
  }
}))

// PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`)
})