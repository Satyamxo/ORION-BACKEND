const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true only for port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// optional but very useful for debugging
const verifyMailConfig = async () => {
  try {
    await mailTransporter.verify();
    console.log("Mail service ready");
  } catch (error) {
    console.error("Mail service configuration error:", error.message);
  }
};

module.exports = {
  mailTransporter,
  verifyMailConfig
};
