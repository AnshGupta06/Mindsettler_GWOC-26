import brevo from "@getbrevo/brevo";
import "dotenv/config";

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY; // Make sure this matches your .env

export const sendEmail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    
    // ⚠️ IMPORTANT: This email MUST match the one you verified in Brevo
    sendSmtpEmail.sender = { 
      name: "MindSettler", 
      email: process.env.SENDER_EMAIL 
    };

    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${to} via Brevo`);
    
  } catch (error) {
    console.error("❌ Email failed:", error?.response?.body || error.message);
  }
};