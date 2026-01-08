// backend/src/controllers/corporateController.ts
import { Request, Response } from 'express';
// Adjust the import path to where you saved the emailService.js file
import { sendEmail } from '../services/emailService'; 

export const submitInquiry = async (req: Request, res: Response) => {
  const { companyName, contactName, email, message } = req.body;

  // Basic validation
  if (!companyName || !contactName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Construct the Email HTML for the user
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3F2965;">Inquiry Received</h2>
        <p>Hello <strong>${contactName}</strong>,</p>
        <p>Thank you for your interest in partnering with <strong>MindSettler</strong> for <strong>${companyName}</strong>'s wellness needs.</p>
        <p>We have successfully received your inquiry and our corporate team will review your requirements shortly.</p>
        
        <div style="background-color: #F9F6FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #Dd1764;">
          <h3 style="margin-top: 0; font-size: 16px; color: #3F2965;">Your Message:</h3>
          <p style="font-style: italic; color: #555; margin-bottom: 0;">"${message}"</p>
        </div>

        <p>We aim to get back to you within 24-48 business hours.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #777; font-size: 12px;">Best Regards,<br/><strong>The MindSettler Team</strong></p>
      </div>
    `;

    // 2. Send the email using your existing service
    await sendEmail(
      email,
      "We received your Corporate Inquiry - MindSettler",
      emailHtml
    );

    return res.status(200).json({ message: "Inquiry submitted successfully" });

  } catch (error) {
    console.error("Corporate Inquiry Error:", error);
    return res.status(500).json({ error: "Failed to process inquiry" });
  }
};