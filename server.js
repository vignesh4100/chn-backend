// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Resend } = require('resend');

dotenv.config();
const app = express();

const corsOptions = {
  origin: ['http://localhost:5174', 'https://chnindia.in'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

// 👇 explicitly handle OPTIONS requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

const resend = new Resend(process.env.RESEND_API_KEY);

// Contact Form Route
app.post('/api/contact', async (req, res) => {
  const { fullName, email, phone, company, subject, message } = req.body;

  if (!fullName || !email || !phone || !subject) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'no-reply@chnindia.com',
      to: 'info@chnindia.com', // Change as needed
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
    });

    res.json({ message: 'Contact email sent successfully' });
  } catch (err) {
    console.error('Resend contact error:', err);
    res.status(500).json({ message: 'Failed to send contact email' });
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

  try {
    await resend.emails.send({
      from: 'no-reply@chnindia.com',
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
          type: resumeType,
          disposition: 'attachment',
        },
      ],
    });

    res.json({ message: 'Career email sent successfully' });
  } catch (err) {
    console.error('Resend career error:', err);
    res.status(500).json({ message: 'Failed to send career email' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
