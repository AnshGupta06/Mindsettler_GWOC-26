import { sendContactMail } from "../services/emailService.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await sendContactMail({ name, email, subject, message });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact mail error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
