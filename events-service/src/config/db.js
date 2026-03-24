const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Event-service DB connected");
  } catch (err) {
    console.error("Event-service DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
