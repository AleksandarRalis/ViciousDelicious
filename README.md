# Vicious Delicious Official Website

Official website for the Vicious Delicious music band with contact form email functionality.

## Features

- Responsive design with mobile menu
- Band members showcase
- Repertoire listing
- Contact form with email functionality

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example` if available):
```bash
PORT=3000

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Recipient email (where contact form messages will be sent)
RECIPIENT_EMAIL=your-email@gmail.com

# Send confirmation email to user (true/false)
SEND_CONFIRMATION=true
```

### Email Configuration

#### For Gmail:

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

#### For Other Email Providers:

Update the SMTP settings in `.env`:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's SMTP settings

### Running the Server

Start the development server:
```bash
npm start
```

Or use nodemon for auto-restart during development:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Production Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Update the `API_URL` in `index.html` if your API is on a different domain
3. Consider using environment-specific configurations
4. Use a process manager like PM2 for Node.js applications

## Project Structure

```
ViciousDelicious/
├── index.html          # Main website file
├── styles.css          # Custom styles
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── .env                # Environment variables (not in git)
├── .gitignore          # Git ignore file
└── Images/             # Image assets
```

## API Endpoints

### POST `/api/send-email`
Sends an email from the contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to book your band!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!",
  "messageId": "..."
}
```

### GET `/api/health`
Health check endpoint.

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of your main account password
- Consider implementing rate limiting for production
- Add CAPTCHA for spam protection if needed

## Troubleshooting

### Email not sending:
1. Verify SMTP credentials in `.env`
2. Check that App Password is correct (for Gmail)
3. Ensure firewall allows outbound SMTP connections
4. Check server logs for detailed error messages

### CORS errors:
- Ensure the frontend and backend are on the same domain, or
- Configure CORS settings in `server.js` for your domain

## License

© 2024 Vicious Delicious. All rights reserved.
