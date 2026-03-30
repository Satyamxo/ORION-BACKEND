const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const { mailTransporter } = require("../config/mail");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes</p>
      `
    });

    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/* =========================
   RESET PASSWORD
========================= */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired token" });

    // DO NOT hash here — middleware will handle it
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   SIGNUP
========================= */
const signup = async (req, res) => {
  try {
    const { enrollment, name, email, password } = req.body;

    if (!enrollment || !name || !email || !password) {
      return res.status(400).json({
        message: "Enrollment, name, email and password are required"
      });
    }

    if (email.toLowerCase().endsWith("@medicaps.ac.in")) {
      return res.status(400).json({
        message: "Please use a personal email address"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ enrollment }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // ❗ DO NOT HASH HERE
    await User.create({
      enrollment,
      name,
      email,
      password, // hashed by pre-save middleware
      approved: false
    });

    res.status(201).json({
      message: "Signup successful. Wait for admin approval."
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    const { enrollment, password } = req.body;

    if (!enrollment || !password) {
      return res.status(400).json({
        message: "Enrollment and password are required"
      });
    }

    const user = await User.findOne({ enrollment });

    if (user.isBlocked) {
  return res.status(403).json({
    message: "You are blocked by admin"
  });
}
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.approved)
      return res.status(403).json({ message: "Account not approved yet" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      userId: user._id,
      enrollment: user.enrollment,
       avatar: user.avatar || null,
      name: user.name,
      role: user.role,
      isBlocked: user.isBlocked 
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =========================
   APPROVE USER (ADMIN)
========================= */
const approveUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.approved)
      return res.status(400).json({ message: "User already approved" });

    user.approved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  approveUser
};