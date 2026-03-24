require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const initSocket = require("./socket");
const Group = require("./models/Group");

const PORT = process.env.PORT || 4003;

const server = http.createServer(app);

// 🔹 Seed CLASS_GROUP once
const seedClassGroup = async () => {
  const exists = await Group.findOne({ groupId: "CLASS_GROUP" });
  if (!exists) {
    await Group.create({
      groupId: "CLASS_GROUP",
      name: "Batch SC23 CS - Class Group",
      isDefault: true
    });
    
  }
};

connectDB().then(async () => {
  await seedClassGroup();

  // init socket AFTER DB ready
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Messaging-service running on port ${PORT}`);
  });
});
