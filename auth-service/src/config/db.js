const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth DB connected to", mongoose.connection.name);
  } catch (err) {
    console.error("DB error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;