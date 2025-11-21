# NewsHub - Email Configuration Guide

## 📧 Email Features

When users interact with NewsHub, they automatically receive email notifications:

### 1. **Welcome Email** (on Signup)
- Sent immediately after user registration
- Contains welcome message and account details
- Professional HTML template with branding

### 2. **Login Notification Email** (on Login)
- Sent every time a user logs in
- Contains login timestamp and account confirmation
- Security alert: Users can report suspicious activity

## 🔧 Setup Instructions

### Option 1: Gmail SMTP (Recommended - Free)

**Step 1:** Enable 2-Factor Authentication
- Go to https://myaccount.google.com
- Click "Security" in left menu
- Enable 2-Step Verification

**Step 2:** Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer"
- Copy the 16-character password

**Step 3:** Update server.js
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',        // Your Gmail address
        pass: 'xxxx xxxx xxxx xxxx'          // 16-char app password
    }
});
```

**Step 4:** Restart Server
```bash
npm start
```

### Option 2: Mailtrap (For Testing - Free)

Best for development and testing.

**Step 1:** Sign Up
- Visit https://mailtrap.io
- Create free account

**Step 2:** Get Credentials
- From dashboard, go to Integration → Nodemailer
- Copy the configuration

**Step 3:** Update server.js
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'your-mailtrap-user',
        pass: 'your-mailtrap-password'
    }
});
```

**Step 4:** Check Inbox
- All emails will appear in Mailtrap dashboard
- No real emails sent (perfect for testing)

### Option 3: SendGrid

**Step 1:** Create Account
- Visit https://sendgrid.com
- Sign up (free tier available)

**Step 2:** Create API Key
- Settings → API Keys → Create API Key

**Step 3:** Install SendGrid
```bash
npm install @sendgrid/mail
```

**Step 4:** Update server.js
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

### Option 4: Mailgun

**Step 1:** Create Account
- Visit https://www.mailgun.com
- Sign up

**Step 2:** Get Credentials
- Dashboard → Sending → Domain Settings
- Copy domain and API key

**Step 3:** Update server.js
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: `postmaster@${process.env.MAILGUN_DOMAIN}`,
        pass: process.env.MAILGUN_API_KEY
    }
});
```

## 🧪 Testing Email

### Test Signup Email:
1. Go to http://localhost:3000/user-login.html
2. Click "Sign up"
3. Fill in form with test email (e.g., your Gmail)
4. Submit
5. Check your email inbox for welcome message

### Test Login Email:
1. Go to http://localhost:3000/user-login.html
2. Enter your test username and password
3. Click "Login"
4. Check your email inbox for login notification

### If Using Mailtrap:
- Don't check your personal email
- Check Mailtrap inbox instead at https://mailtrap.io

## 📋 Email Templates

### Welcome Email Template:
- Subject: "🎉 Welcome to NewsHub! Account Created Successfully"
- Contains: Welcome message, account details, call-to-action button
- Design: Professional gradient header with branded footer

### Login Notification Email Template:
- Subject: "🔐 Login Notification - NewsHub Account Access"
- Contains: Login confirmation, timestamp, security notice
- Design: Same professional styling with security icon

## ⚙️ Email Configuration in Code

File: `server.js` (lines 18-78)

Two functions handle email sending:
- `sendWelcomeEmail(userEmail, username)` - For new signups
- `sendLoginNotificationEmail(userEmail, username)` - For logins

## 🔒 Security Notes

**Important:** Never commit real credentials to version control!

Use environment variables (recommended):
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});
```

Then create `.env` file (gitignored):
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

## 🐛 Troubleshooting

### Emails not sending:
1. Check server console for error messages
2. Verify email credentials are correct
3. Check if 2FA is enabled (Gmail)
4. Verify "Less secure apps" setting (older Gmail accounts)
5. Try using Mailtrap to test

### Gmail: "Invalid login attempt"
1. Enable 2-Factor Authentication
2. Use App Password (not regular password)
3. Verify the 16-character password is correct

### Mailtrap: All features working?
1. Check Inbox tab for received emails
2. All emails sent in development will appear here
3. Once testing complete, switch to production email service

## 📊 API Endpoints

### User Registration (sends Welcome Email)
```
POST /api/users/register
Body: { username, email, password }
Response: { success, user, token }
```

### User Login (sends Login Notification Email)
```
POST /api/users/login
Body: { username, password }
Response: { success, user, token }
```

## 🚀 Production Deployment

For production:
1. Use environment variables for all credentials
2. Use professional email service (SendGrid, Mailgun, AWS SES)
3. Add email verification for new signups (optional)
4. Implement email templates in database
5. Add email preferences/unsubscribe option
6. Monitor email delivery rates
7. Set up bounce handling

## 📝 Next Steps

1. Choose email service (Gmail for simple, Mailtrap for testing)
2. Update credentials in server.js
3. Install dependencies: `npm install`
4. Restart server: `npm start`
5. Test by creating new user account
6. Check email inbox for welcome message

---

**Support:** Check server logs for email sending status messages.
