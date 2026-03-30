import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

// ✅ CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// ✅ Debug
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url)
  next()
})

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Gateway working 🚀")
})

/**
 * 🔐 AUTH SERVICE
 * Frontend → /api/auth → Backend → /api/auth
 */
app.use("/api/auth", createProxyMiddleware({
  target: process.env.AUTH_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/api/auth": "/api/auth"
  },
  onError: (err, req, res) => {
    console.error("Auth proxy error:", err.message)
    res.status(500).send("Auth service error")
  }
}))

/**
 * 👤 USER SERVICE
 */
app.use("/api/users", createProxyMiddleware({
  target: process.env.USER_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/api/users": "/api/users"
  },
  onError: (err, req, res) => {
    console.error("User proxy error:", err.message)
    res.status(500).send("User service error")
  }
}))

/**
 * 💬 MESSAGE SERVICE
 */
app.use("/api/messages", createProxyMiddleware({
  target: process.env.CHAT_URL,
  changeOrigin: true,
  secure: false,
  ws: true,
  pathRewrite: {
    "^/api/messages": "/api/messages"
  },
  onError: (err, req, res) => {
    console.error("Message proxy error:", err.message)
    res.status(500).send("Message service error")
  }
}))

/**
 * 📅 EVENTS SERVICE
 */
app.use("/api/events", createProxyMiddleware({
  target: process.env.EVENTS_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/api/events": "/api/events"
  },
  onError: (err, req, res) => {
    console.error("Events proxy error:", err.message)
    res.status(500).send("Events service error")
  }
}))

/**
 * 🖼 MEDIA SERVICE
 */
app.use("/api/media", createProxyMiddleware({
  target: process.env.MEDIA_URL,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/api/media": "/api/media"
  },
  onError: (err, req, res) => {
    console.error("Media proxy error:", err.message)
    res.status(500).send("Media service error")
  }
}))

// ✅ PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`)
})