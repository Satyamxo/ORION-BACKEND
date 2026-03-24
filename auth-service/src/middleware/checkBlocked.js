const checkBlocked = (req, res, next) => {
  if (req.user.isBlocked) {
    return res.status(403).json({
      message: "You are blocked by admin"
    });
  }

  next();
};

module.exports = checkBlocked;