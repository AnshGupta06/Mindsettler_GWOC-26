import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY); //

export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "MindSettler <onboarding@resend.dev>", 
      to,
      subject,
      html,
    });

    console.log(`📧 Booking Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};