const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");
const registerHandlers = require("./handlers");
require("dotenv").config(); // 🔥 MUST be at the TOP
const CLASS_GROUP_ID = "CLASS_GROUP";

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // later restrict to frontend URL
      methods: ["GET", "POST"]
    }
  });

  // 🔐 JWT authentication for sockets
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const { userId } = socket.user;

    

    // 🔹 Auto-join global class group
    socket.join(CLASS_GROUP_ID);
    socket.join(userId); // personal room for private messages


    // Register message handlers
    registerHandlers(io, socket);

    socket.on("disconnect", () => {
      
    });
  });

  return io;
};

module.exports = initSocket;
