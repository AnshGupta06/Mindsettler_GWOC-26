import nodemailer from "nodemailer";

// Use your Gmail or an App Password (recommended for Gmail)
// Guide to App Password: Google Account > Security > 2-Step Verification > App Passwords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shsheth2006@gmail.com", // Your Admin Email
    pass: "dzyd unaw drde ufzu", // ⚠️ REPLACE THIS
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"MindSettler" <shsheth2006@gmail.com>',
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};