import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()

app.use("/auth", createProxyMiddleware({
  target: "http://auth-service:4001",
  changeOrigin: true,
  pathRewrite: { "^/auth": "" }
}))

app.use("/user", createProxyMiddleware({
  target: "http://user-service:4002",
  changeOrigin: true,
  pathRewrite: { "^/user": "" }
}))

app.use("/chat", createProxyMiddleware({
  target: "http://messaging-service:4003",
  changeOrigin: true,
  pathRewrite: { "^/chat": "" }
}))

app.use("/events", createProxyMiddleware({
  target: "http://events-service:4004",
  changeOrigin: true,
  pathRewrite: { "^/events": "" }
}))

app.use("/media", createProxyMiddleware({
  target: "http://media-service:5004",
  changeOrigin: true,
  pathRewrite: { "^/media": "" }
}))

app.get("/", (req, res) => {
  res.send("Gateway working")
})

app.listen(5000, () => {
  console.log("Gateway running on port 5000")
})