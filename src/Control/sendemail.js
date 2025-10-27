import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Gmail ID
    pass: process.env.SMTP_PASS, // App Password (ya SMTP pass)
  },
});

export const sendMail = async (req, res) => {
  try {
    const user = req.user; // authMiddleware se
    if (!user || !user.email) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const { name, subject, message } = req.body;

    if (!name || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, subject, and message",
      });
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject,
      message: `Hi ${name},\n\n${message}\n\nRegards,\nYour Team`,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};
