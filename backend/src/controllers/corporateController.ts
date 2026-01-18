import { Request, Response } from 'express';

import { sendCorporateInquiryReceivedEmail } from '../services/emailService.js'; 

export const submitInquiry = async (req: Request, res: Response) => {
  const { companyName, contactName, email, message } = req.body;

  
  if (!companyName || !contactName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    
    await sendCorporateInquiryReceivedEmail(
      email,
      contactName,
      companyName,
      message
    );

    return res.status(200).json({ message: "Inquiry submitted successfully" });

  } catch (error) {
    console.error("Corporate Inquiry Error:", error);
    return res.status(500).json({ error: "Failed to process inquiry" });
  }
};