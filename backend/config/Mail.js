import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "otpservicebyvybe@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (reciverEmail, otp) => {
  const info = await transporter.sendMail({
    from: `${process.env.EMAIL}`,
    to: `${reciverEmail}`,
    subject: "Reset your password",
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">Password Reset Request</h2>
    <p>Dear User,</p>
    <p>You have requested to reset your password. Please use the One-Time Password (OTP) provided below:</p>
    <p style="font-size: 18px; font-weight: bold; color: #e74c3c;">${otp}</p>
    <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone for security reasons.</p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <br/>
    <p>Best regards,<br/>The Vybe Support Team</p>
  </div>
`,
  });

  console.log("Message sent:", info.messageId);
};
export default sendMail;
