const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(cors({
  origin: ['http://localhost:5174', 'https://chnindia.in'], // update later when deployed
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Contact Form Route
app.post('/api/contact', async (req, res) => {
  const { fullName, email, phone, company, subject, message } = req.body;

  if (!fullName || !email || !phone || !subject) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"${fullName}" <${process.env.SMTP_USER}>`,
    to: 'info@chnindia.com',
    subject: `New Contact - ${subject}`,
    html: `
      <h2>Contact Request</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Contact email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Career Form Route
app.post('/api/career', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    position,
    message,
    resumeBase64,
    resumeName,
    resumeType,
  } = req.body;

  if (!fullName || !email || !phone || !position || !resumeBase64) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"${fullName}" <${process.env.SMTP_USER}>`,
    to: 'info@chnindia.com',
    subject: `New Career Application - ${position}`,
    html: `
      <h2>New Career Application</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
    attachments: [
      {
        filename: resumeName,
        content: resumeBase64,
        encoding: 'base64',
        contentType: resumeType,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Career email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send career email' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
