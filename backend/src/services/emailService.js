import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "MindSettler <onboarding@resend.dev>", 
      to,
      subject,
      html,
    }); 

    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactMail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"MindSettler Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
