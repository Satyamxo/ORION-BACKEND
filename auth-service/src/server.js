// require("dotenv").config();

// const app = require("./app");
// const connectDB = require("./config/db");

// const PORT = process.env.PORT || 4001;

// // Connect DB first, then start server
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Auth-service running on port ${PORT}`);
//   });
// });
require("dotenv").config();


const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4001;

// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Setup Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 Make io globally accessible
global.io = io;

// 🔥 Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id); // 🔥 debug

  socket.on("register", (userId) => {
    const room = userId.toString(); // 🔥 FIX

    socket.join(room);

    console.log(`User ${room} joined room`); // 🔥 debug
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// Connect DB then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Auth-service running on port ${PORT}`);
  });
});