const { verifyToken } = require("../config/jwt");

/**
 * HTTP Auth Middleware
 * Verifies JWT and attaches user to req
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expecting: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    req.user = {
  userId: decoded.userId,
  enrollment: decoded.enrollment,
  name: decoded.name,   
  role: decoded.role
};

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
