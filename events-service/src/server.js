require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { verifyMailConfig } = require("./config/mail");

const PORT = process.env.PORT || 4004;

connectDB().then(async () => {
  // verify mail config (non-blocking)
  await verifyMailConfig();

  app.listen(PORT, () => {
    console.log(`Event-service running on port ${PORT}`);
  });
});
