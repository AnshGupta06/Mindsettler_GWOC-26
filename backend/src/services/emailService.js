import brevo from "@getbrevo/brevo";
import "dotenv/config";


if (!process.env.BREVO_API_KEY) {
  console.error("⚠️ FATAL: BREVO_API_KEY is missing in .env file");
}
if (!process.env.SENDER_EMAIL) {
  console.warn("⚠️ WARNING: SENDER_EMAIL is missing in .env file");
}

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const createEmailTemplate = (title, bodyContent, ctaLink = null, ctaText = null) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background-color: #F9F6FF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color: #3F2965; padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px; }
    .cta-button { display: inline-block; background-color: #Dd1764; color: #ffffff !important; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px; font-size: 16px; box-shadow: 0 4px 10px rgba(221, 23, 100, 0.3); }
    .footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
    .highlight { color: #3F2965; font-weight: bold; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .info-table td { padding: 10px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; color: #3F2965; width: 40%; }
    .info-table td:last-child { color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MindSettler</h1>
    </div>
    <div class="content">
      <h2 style="color:#3F2965; margin-top:0;">${title}</h2>
      ${bodyContent}
      ${ctaLink ? `<div style="text-align:center; margin-top: 30px;"><a href="${ctaLink}" class="cta-button">${ctaText}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} MindSettler Therapy. All rights reserved.</p>
      <p>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;

const sendHtmlEmail = async (to, subject, html) => {
  console.log(`📨 Attempting to send email to: ${to}`);
  
  if (!process.env.BREVO_API_KEY) {
    console.error("❌ Email failed: BREVO_API_KEY is not set.");
    return;
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "MindSettler", email: process.env.SENDER_EMAIL || "no-reply@mindsettler.com" };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent successfully to ${to}. Message ID: ${data.messageId}`);
  } catch (error) {
    console.error("❌ Email failed:", error?.response?.body || error.message);
  }
};


export const sendWelcomeEmail = async (email, name) => {
  const html = createEmailTemplate(
    "Welcome to Your Healing Journey 🌿",
    `<p>Hi ${name},</p>
     <p>We are honored that you've chosen <strong>MindSettler</strong>. Taking the first step towards mental well-being is often the hardest, and we are here to support you.</p>
     <p>You can now browse available slots, choose your preferred therapy mode, and book sessions directly from your dashboard.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/book`,
    "Book Your First Session"
  );
  await sendHtmlEmail(email, "Welcome to MindSettler", html);
};


export const sendBookingRejectedEmail = async (email, name, date, reason) => {
  const html = createEmailTemplate(
    "Session Status Update",
    `<p>Hi ${name},</p>
     <p>We regret to inform you that your requested session for <span class="highlight">${date}</span> could not be confirmed.</p>
     ${reason ? `<p style="background:#FFF0F0; padding:15px; border-left:4px solid #FF4444; border-radius:4px; margin: 20px 0;"><strong>Reason:</strong> ${reason}</p>` : ""}
     <p>We apologize for the inconvenience. Please check our calendar for other available slots.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/book`,
    "View Available Slots"
  );
  await sendHtmlEmail(email, "Update regarding your session request", html);
};


export const sendUserBlockedEmail = async (email, name) => {
  const html = createEmailTemplate(
    "Important Account Notice",
    `<p>Hi ${name},</p>
     <p>Your account has been temporarily restricted from making new bookings due to a violation of our policies (e.g., repeated cancellations or no-shows).</p>
     <p>If you believe this is an error, please contact our support team immediately.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    "Contact Support"
  );
  await sendHtmlEmail(email, "Account Access Restricted", html);
};


export const sendSessionReminderEmail = async (email, name, link, mode) => {
  const isOnline = mode === "ONLINE";
  const html = createEmailTemplate(
    "Your Session Starts in 10 Minutes ⏰",
    `<p>Hi ${name},</p>
     <p>This is a gentle reminder that your therapy session is about to begin.</p>
     ${isOnline 
       ? `<p>Please ensure you are in a quiet comfortable space with a stable internet connection.</p>` 
       : `<p>We look forward to seeing you at the clinic.</p>`}
     <p>Take a deep breath. We are ready for you.</p>`,
    isOnline ? link : null,
    isOnline ? "Join Video Call" : null
  );
  await sendHtmlEmail(email, "Reminder: Session starting soon", html);
};


export const sendBookingConfirmedEmail = async (email, name, date, time, link, mode) => {
  const isOnline = mode === "ONLINE";
  
  const instructionContent = isOnline 
    ? `<p>Please note that the option to join the meeting will automatically appear on your <strong>Profile Page</strong> 10 minutes before the scheduled start time.</p>
       <p>Please be ready 5 minutes early in a quiet space.</p>`
    : `<p>We look forward to welcoming you at our clinic.</p>
       <p>Please arrive <strong>5 minutes before</strong> your scheduled time to complete any necessary intake formalities.</p>`;

  const html = createEmailTemplate(
    "Booking Confirmed ✅",
    `<p>Hi ${name},</p>
     <p>Your <strong>${mode === "ONLINE" ? "Online" : "In-Person"}</strong> session on <span class="highlight">${date}</span> at <span class="highlight">${time}</span> has been confirmed.</p>
     ${instructionContent}`,
    `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    "Go to My Profile"
  );
  await sendHtmlEmail(email, "Booking Confirmed ✅", html);
};

// --- UPDATED ADMIN EMAIL FUNCTION ---
export const sendNewBookingAdminEmail = async (adminEmail, { userName, userEmail, phone, attendees, status, type, therapyType, reason }) => {
  if (!adminEmail) {
    console.error("❌ Admin email failed: No admin email address provided (Check env.ADMIN_EMAIL)");
    return;
  }
  
  const html = createEmailTemplate(
    "New Booking Request 🔔",
    `<p>A new booking request has been received. Please review the details below:</p>
     
     <table class="info-table">
        <tr>
            <td>Client Name:</td>
            <td>${userName}</td>
        </tr>
        <tr>
            <td>Email:</td>
            <td>${userEmail}</td>
        </tr>
        <tr>
            <td>Phone:</td>
            <td>${phone || "Not provided"}</td>
        </tr>
        <tr>
            <td>Session Type:</td>
            <td><span style="background:#F3E8FF; color:#3F2965; padding:2px 8px; border-radius:4px; font-weight:bold;">${type}</span></td>
        </tr>
        <tr>
            <td>Therapy Mode:</td>
            <td>${therapyType || "General"}</td>
        </tr>
        <tr>
            <td>Attendees:</td>
            <td>${attendees} Person(s)</td>
        </tr>
        <tr>
            <td>Marital Status:</td>
            <td>${status || "N/A"}</td>
        </tr>
     </table>

     <div style="background:#FFF; border:1px solid #eee; padding:15px; border-radius:8px; margin-top:10px;">
        <strong>Reason / Notes:</strong><br/>
        <i style="color:#555;">"${reason || "No notes provided"}"</i>
     </div>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
    "Open Admin Dashboard"
  );
  await sendHtmlEmail(adminEmail, "New Booking Request", html);
};


export const sendBookingCancelledEmail = async (email, name, date, time) => {
  const html = createEmailTemplate(
    "Session Cancelled ❌",
    `<p>Hi ${name},</p>
     <p>Your session scheduled for <span class="highlight">${date}</span> at <span class="highlight">${time}</span> has been successfully cancelled as per your request.</p>
     <p>If you would like to reschedule, please visit the booking page.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/book`,
    "Book New Session"
  );
  await sendHtmlEmail(email, "Session Cancelled", html);
};


export const sendRefundRequestedEmail = async (email, name, date, time) => {
  const html = createEmailTemplate(
    "Refund Request Initiated 💸",
    `<p>Hi ${name},</p>
     <p>You have cancelled your confirmed session scheduled for <span class="highlight">${date}</span> at <span class="highlight">${time}</span>.</p>
     <p>A <strong>refund request</strong> has been automatically raised with our admin team. The amount will be credited back to your original payment method (or via UPI) within 24-48 business hours.</p>
     <p>If you have any questions, simply reply to this email.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    "Contact Support"
  );
  await sendHtmlEmail(email, "Refund Request Received", html);
};


export const sendAdminRefundAlert = async (adminEmail, { userName, userEmail, date, time, refundAmount }) => {
  if (!adminEmail) return;
  
  const html = createEmailTemplate(
    "ACTION REQUIRED: Process Refund ⚠️",
    `<p>A user has cancelled a <strong>CONFIRMED</strong> session.</p>
     <p><strong>User:</strong> ${userName} (${userEmail})</p>
     <p><strong>Session:</strong> ${date} at ${time}</p>
     <p>Please check the payment records and process the refund manually.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings`,
    "View Bookings"
  );
  await sendHtmlEmail(adminEmail, "Refund Action Required", html);
};


export const sendAdminReportEmail = async (email, name, reportContent, adminName = "Admin") => {
  const html = createEmailTemplate(
    "Important Update from Your Therapist 📋",
    `<p>Hi ${name},</p>
     <p>Your therapist has prepared an important report for you. This contains valuable insights, progress notes, and recommendations based on your sessions.</p>
     
     <div style="background:#F9F6FF; padding:20px; border-radius:12px; border-left:4px solid #3F2965; margin:25px 0;">
       <h3 style="color:#3F2965; margin-top:0; font-size:18px;">📋 Therapist Report</h3>
       <div style="color:#333; line-height:1.6; white-space:pre-line;">${reportContent.replace(/\n/g, '<br>')}</div>
     </div>
     
     <p>If you have any questions about this report or would like to discuss it further, please don't hesitate to reach out.</p>
     <p>Remember, your mental health journey is unique, and we're here to support you every step of the way.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    "Contact Your Therapist"
  );
  await sendHtmlEmail(email, "Therapist Report & Update", html);
};


export const sendSessionNotesToUser = async (email, name, notes) => {
  const html = createEmailTemplate(
    "Your Session Notes 📝",
    `<p>Hi ${name},</p>
     <p>Thank you for your session with us. Here are the key notes and insights from your meeting:</p>
     
     <div style="background:#F0F9FF; padding:20px; border-radius:12px; border-left:4px solid #0369A1; margin:25px 0;">
       <h3 style="color:#0369A1; margin-top:0; font-size:18px;">📝 Session Notes</h3>
       <div style="color:#333; line-height:1.6; white-space:pre-line;">${notes.replace(/\n/g, '<br>')}</div>
     </div>
     
     <p>These notes are designed to help you reflect on your progress and prepare for future sessions. If you have any questions or need clarification, please feel free to reach out.</p>
     <p>We're here to support your mental health journey.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
    "Contact Us"
  );
  await sendHtmlEmail(email, "Your Session Notes", html);
};


export const sendTherapistNotesToAdmin = async (adminEmail, userName, userEmail, therapistNotes) => {
  if (!adminEmail) return;
  
  const html = createEmailTemplate(
    "Therapist Notes for Session 📋",
    `<p>A therapist has submitted private notes for a recent session.</p>
     <p><strong>Client:</strong> ${userName} (${userEmail})</p>
     
     <div style="background:#FEF3C7; padding:20px; border-radius:12px; border-left:4px solid #D97706; margin:25px 0;">
       <h3 style="color:#D97706; margin-top:0; font-size:18px;">🔒 Therapist Notes (Private)</h3>
       <div style="color:#333; line-height:1.6; white-space:pre-line;">${therapistNotes.replace(/\n/g, '<br>')}</div>
     </div>
     
     <p>These notes contain confidential therapist observations and should be handled appropriately.</p>`,
    `${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings`,
    "View Bookings"
  );
  await sendHtmlEmail(adminEmail, "Therapist Notes Submitted", html);
};