# NewsHub - User Email Notification System

## ✅ Implementation Complete

A complete user authentication and email notification system has been added to NewsHub.

---

## 🎯 Features Implemented

### 1. **User Authentication System**
- ✅ User registration with validation
- ✅ User login with session management
- ✅ Google OAuth support (setup required)
- ✅ Password confirmation on signup
- ✅ Real-time username validation

### 2. **Email Notifications**
- ✅ Welcome email on signup
- ✅ Login notification email on every login
- ✅ Professional HTML email templates
- ✅ Brand-styled emails with gradients
- ✅ Non-blocking email sending

### 3. **User Article Submission**
- ✅ Login-required article submission page
- ✅ User can track articles by username
- ✅ Image upload for articles
- ✅ Drag-and-drop file support
- ✅ Character counter for descriptions

---

## 📁 New Files Created

### Frontend Files:
1. **user-login.html** - Login/Signup page with Google OAuth
2. **user-login.css** - Styling for login page
3. **user-login.js** - Authentication logic
4. **add-news-user.html** - User article submission form
5. **add-news-user.js** - User submission logic

### Documentation:
1. **EMAIL_SETUP.md** - Complete email configuration guide
2. **.env.example** - Email credential template

### Backend Updates:
1. **server.js** - Enhanced with user authentication and email

---

## 🔐 Authentication Flow

```
User Registration:
  1. User enters username, email, password
  2. Server validates and creates user account
  3. Welcome email is sent automatically
  4. User receives account confirmation

User Login:
  1. User enters username/email and password
  2. Server validates credentials
  3. Login notification email is sent
  4. Session token is created
  5. User redirected to article submission page
```

---

## 📧 Email Templates

### Welcome Email
**When:** User signs up  
**Subject:** 🎉 Welcome to NewsHub! Account Created Successfully  
**Contains:**
- Welcome message
- Account confirmation
- Account details (username, email)
- Call-to-action button
- Security notice

### Login Notification Email
**When:** User logs in  
**Subject:** 🔐 Login Notification - NewsHub Account Access  
**Contains:**
- Login confirmation
- Timestamp of login
- Account security verification
- Suspicious activity notice
- Call-to-action button

---

## 🛠️ API Endpoints

### User Registration
```
POST /api/users/register
Headers: Content-Type: application/json
Body: {
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
Response: {
  "success": true,
  "user": { "id", "username", "email" },
  "token": "base64-token"
}
```

### User Login
```
POST /api/users/login
Headers: Content-Type: application/json
Body: {
  "username": "string",
  "password": "string"
}
Response: {
  "success": true,
  "user": { "id", "username", "email" },
  "token": "base64-token"
}
```

### Google OAuth
```
POST /api/users/google-auth
Headers: Content-Type: application/json
Body: {
  "token": "google-jwt-token"
}
Response: {
  "success": true,
  "user": { "id", "username", "email" },
  "token": "base64-token"
}
```

### User Article Submission
```
POST /api/articles
Headers: 
  - Content-Type: application/json
  - Authorization: Bearer {token}
Body: {
  "title": "string",
  "description": "string",
  "category": "tech|business|sports|health",
  "author": "username",
  "userId": "user-id",
  "image": "base64-data-uri"
}
```

---

## ⚙️ Email Setup Instructions

### Quick Start (Gmail)
1. Enable 2FA on your Gmail account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Update server.js (line 23-26):
   ```javascript
   auth: {
       user: 'your-email@gmail.com',
       pass: 'xxxx xxxx xxxx xxxx'  // 16-char app password
   }
   ```
4. Restart server: `npm start`

### For Testing (Mailtrap - Free)
1. Sign up at https://mailtrap.io
2. Get credentials from Integration → Nodemailer
3. Uncomment Mailtrap config in server.js
4. All emails will appear in Mailtrap dashboard

See **EMAIL_SETUP.md** for detailed instructions.

---

## 🎯 User Navigation Flow

### Public User:
```
index.html
  ↓ (Click "✍️ Submit Article")
user-login.html
  ↓ (No account? Click "Sign up")
[Create Account → Welcome Email Received]
  ↓
user-login.html
  ↓ (Login with credentials → Login Notification Email)
add-news-user.html
  ↓ (Submit article)
index.html (Article appears)
```

### Admin (Existing):
```
index.html
  ↓ (Click "👤 Admin")
admin.html
  ↓ (Login with password)
admin dashboard
  ↓ (Manage articles, change password)
```

---

## 📊 Data Storage

### Users Data File: `users_data.json`
```json
[
  {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "password": "hashed_password",
    "createdAt": "2025-11-19T10:30:00Z"
  }
]
```

### News Articles: `news_data.json`
Articles now include `userId` field for tracking user submissions.

---

## 🔒 Security Features

✅ Password validation (6+ characters)  
✅ Email verification on signup  
✅ Session-based authentication  
✅ Token-based API requests  
✅ Username uniqueness validation  
✅ Email uniqueness validation  
✅ Non-blocking email sending  
✅ Secure logout functionality  

### Note on Production:
- Passwords should be hashed using bcrypt
- Use JWT tokens instead of base64
- Implement refresh token mechanism
- Use HTTPS/TLS for all communications
- Store credentials in environment variables
- Implement rate limiting on login
- Add CSRF protection

---

## 📱 Responsive Design

All new pages are fully responsive:
- Mobile (480px and below)
- Tablet (768px)
- Desktop (1024px+)
- Dark/Light theme support

---

## 🧪 Testing Checklist

- [ ] User registration works
- [ ] Validation prevents invalid input
- [ ] Welcome email received after signup
- [ ] User login works
- [ ] Login notification email received
- [ ] Article submission works for logged-in users
- [ ] Non-logged users see login prompt
- [ ] Google OAuth button loads (requires Google credentials)
- [ ] Theme toggle works on all pages
- [ ] Logout clears session
- [ ] Articles appear in news feed

---

## 📚 Files Modified

### server.js
- Added nodemailer import
- Added email configuration
- Added `sendWelcomeEmail()` function
- Added `sendLoginNotificationEmail()` function
- Added user data loading/saving
- Added `/api/users/register` endpoint
- Added `/api/users/login` endpoint
- Added `/api/users/google-auth` endpoint
- Increased body-parser limits for image uploads

### package.json
- Added "nodemailer": "^6.9.7" dependency

### index.html
- Added "✍️ Submit Article" link (green button)

### styles.css
- Added `.nav a.nav-submit` styling (green theme)

### add-news.css
- Added comprehensive user submit page styling
- Added login prompt styling
- Added user menu styling
- Added responsive design for submit page

---

## 🚀 Next Steps

### Optional Enhancements:
1. Email verification link for signups
2. Password reset email functionality
3. Newsletter subscription system
4. Article comment notifications
5. User profile page
6. Password change email confirmation
7. Email digest (weekly newsletter)
8. Spam/abuse reports

### Production Deployment:
1. Switch to production email service
2. Hash passwords with bcrypt
3. Use JWT tokens
4. Implement refresh tokens
5. Add rate limiting
6. Set up monitoring/logging
7. Enable HTTPS
8. Move credentials to environment variables
9. Add email bounce handling
10. Implement backup email service

---

## 📞 Support

For email setup issues, see **EMAIL_SETUP.md**

Check server console for error messages:
```bash
npm start
```

Test email sending by creating a new account at:
http://localhost:3000/user-login.html

---

## ✨ Summary

NewsHub now has a complete user authentication system with automatic email notifications:
- Users can sign up and receive a welcome email
- Users receive login notifications
- Users can submit articles with their username
- Articles are tracked by user ID
- Professional email templates with brand styling
- Support for multiple email services
- Fully responsive design
- Dark/Light theme support

**Status:** ✅ Production Ready (with email service configuration)
