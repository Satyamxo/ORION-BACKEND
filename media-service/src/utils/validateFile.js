const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const sizeLimits = {
  chat: 2 * 1024 * 1024,
  event: 5 * 1024 * 1024,
  profile: 1 * 1024 * 1024,
};

module.exports = (file, context) => {
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type");
  }

  if (file.size > sizeLimits[context]) {
    throw new Error("File size exceeded");
  }
};
