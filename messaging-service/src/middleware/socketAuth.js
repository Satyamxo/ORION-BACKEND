const { verifyToken } = require("../config/jwt");

const socketAuth = (socket, next) => {
  try {
    // Client should send token in handshake.auth
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = verifyToken(token);
    // decoded = { userId, role, iat, exp }

    socket.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};

module.exports = socketAuth;
