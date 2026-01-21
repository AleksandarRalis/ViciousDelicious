const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    // Use environment variables for email configuration
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter;
};

// Email route
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }

        // Check if SMTP credentials are configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('SMTP credentials not configured');
            return res.status(500).json({ 
                success: false, 
                error: 'Email service not configured. Please contact the administrator.' 
            });
        }

        const transporter = createTransporter();

        // Email to band (notification)
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
            subject: `New Contact Form Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Message</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 3px;">${message}</p>
                    </div>
                    <p style="color: #666; font-size: 12px;">This message was sent from the Vicious Delicious contact form.</p>
                </div>
            `,
            text: `
New Contact Form Message

From: ${name}
Email: ${email}

Message:
${message}
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        // Optional: Send confirmation email to user
        if (process.env.SEND_CONFIRMATION === 'true') {
            const confirmationMail = {
                from: `"Vicious Delicious" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Thank you for contacting Vicious Delicious',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Thank you for your message!</h2>
                        <p>Hi ${name},</p>
                        <p>We've received your message and will get back to you as soon as possible.</p>
                        <p>Best regards,<br>Vicious Delicious</p>
                    </div>
                `,
                text: `Thank you for your message!\n\nHi ${name},\n\nWe've received your message and will get back to you as soon as possible.\n\nBest regards,\nVicious Delicious`
            };

            await transporter.sendMail(confirmationMail);
        }

        res.json({ 
            success: true, 
            message: 'Email sent successfully!',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response,
            command: error.command
        });
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Make sure to configure your .env file with SMTP credentials`);
});
