const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

// Email Configuration
// Using Gmail SMTP - for production, use environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail
        pass: 'your-app-password' // Replace with Gmail App Password
    }
});

// Alternative: Using Mailtrap for testing (free)
// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//         user: 'your-mailtrap-user',
//         pass: 'your-mailtrap-pass'
//     }
// });

// Send welcome email function
function sendWelcomeEmail(userEmail, username) {
    const mailOptions = {
        from: 'noreply@newshub.com',
        to: userEmail,
        subject: '🎉 Welcome to NewsHub! Account Created Successfully',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px;">📰 Welcome to NewsHub!</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Hello ${username}!</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Congratulations! Your NewsHub account has been successfully created. You can now:
                    </p>
                    <ul style="color: #666; font-size: 16px; line-height: 1.8; margin: 20px 0;">
                        <li>✓ Read the latest news and articles</li>
                        <li>✓ Submit your own articles to the platform</li>
                        <li>✓ Share your stories with our community</li>
                        <li>✓ Switch between light and dark themes</li>
                    </ul>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        <strong>Your Account Details:</strong><br>
                        Username: <strong>${username}</strong><br>
                        Email: <strong>${userEmail}</strong>
                    </p>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        To get started, visit our website and login with your credentials.
                    </p>
                    <a href="http://localhost:3000/index.html" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; font-weight: bold;">
                        Go to NewsHub
                    </a>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        If you did not create this account, please contact our support team immediately.<br>
                        <strong>NewsHub Support Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    // Send email (non-blocking)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email sending error:', error);
        } else {
            console.log('Welcome email sent to:', userEmail);
        }
    });
}

// Send login notification email
function sendLoginNotificationEmail(userEmail, username) {
    const mailOptions = {
        from: 'noreply@newshub.com',
        to: userEmail,
        subject: '🔐 Login Notification - NewsHub Account Access',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">🔐 Login Notification</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Hello ${username}!</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Your account was just accessed successfully. Here are the details:
                    </p>
                    <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #1e40af; margin: 5px 0;">
                            <strong>📝 Login Details:</strong><br>
                            Username: <strong>${username}</strong><br>
                            Time: <strong>${new Date().toLocaleString()}</strong><br>
                            Account: <strong>Active ✓</strong>
                        </p>
                    </div>
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        If this wasn't you, please change your password immediately and contact our support team.
                    </p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="http://localhost:3000/index.html" style="display: inline-block; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 10px; font-weight: bold;">
                            Go to NewsHub
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
                        This is an automated message. Please do not reply to this email.<br>
                        <strong>NewsHub Support Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    // Send email (non-blocking)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email sending error:', error);
        } else {
            console.log('Login notification email sent to:', userEmail);
        }
    });
}

// Data file path
const dataFile = path.join(__dirname, 'news_data.json');

// Initialize news data
let newsData = [];

// Load existing news data from file
function loadNewsData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            newsData = JSON.parse(data);
        } else {
            newsData = getDefaultNews();
            saveNewsData();
        }
    } catch (error) {
        console.error('Error loading news data:', error);
        newsData = getDefaultNews();
    }
}

// Save news data to file
function saveNewsData() {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(newsData, null, 2));
    } catch (error) {
        console.error('Error saving news data:', error);
    }
}

// Default news articles
function getDefaultNews() {
    return [
        {
            id: uuidv4(),
            title: "AI Breakthrough: New Model Achieves Human-Level Performance",
            description: "Researchers announce a groundbreaking artificial intelligence model that matches human cognitive abilities in multiple domains.",
            category: "tech",
            image: "https://via.placeholder.com/400x300?text=AI+Breakthrough",
            author: "Sarah Chen",
            date: "Nov 18, 2025"
        },
        {
            id: uuidv4(),
            title: "Stock Market Reaches Record High Amid Economic Growth",
            description: "Global markets surge as economic indicators show sustained growth and investor confidence remains strong.",
            category: "business",
            image: "https://via.placeholder.com/400x300?text=Stock+Market",
            author: "Michael Torres",
            date: "Nov 18, 2025"
        },
        {
            id: uuidv4(),
            title: "Championship League: Team Wins Historic Victory",
            description: "In an incredible match, the home team secures an unprecedented championship title with a stunning performance.",
            category: "sports",
            image: "https://via.placeholder.com/400x300?text=Sports+Victory",
            author: "Alex Johnson",
            date: "Nov 17, 2025"
        },
        {
            id: uuidv4(),
            title: "New Study Shows Benefits of Mediterranean Diet",
            description: "Health researchers confirm that the Mediterranean diet significantly reduces risk of cardiovascular diseases.",
            category: "health",
            image: "https://via.placeholder.com/400x300?text=Health+Study",
            author: "Dr. Emma Wilson",
            date: "Nov 17, 2025"
        }
    ];
}

// Routes

// Get all news
app.get('/api/news', (req, res) => {
    res.json(newsData);
});

// Get news by category
app.get('/api/news/category/:category', (req, res) => {
    const category = req.params.category;
    const filtered = category === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === category);
    res.json(filtered);
});

// Add new news article
app.post('/api/news', (req, res) => {
    const { title, description, category, author, image } = req.body;

    // Validation
    if (!title || !description || !category || !author) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newArticle = {
        id: uuidv4(),
        title,
        description,
        category,
        author,
        image: image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(title)}`,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    };

    newsData.unshift(newArticle);
    saveNewsData();

    res.status(201).json({ 
        message: 'News article added successfully', 
        article: newArticle 
    });
});

// Delete news article
app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const index = newsData.findIndex(article => article.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Article not found' });
    }

    const deletedArticle = newsData.splice(index, 1);
    saveNewsData();

    res.json({ 
        message: 'Article deleted successfully', 
        article: deletedArticle[0] 
    });
});

// Update news article
app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, category, author, image } = req.body;
    
    const article = newsData.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({ error: 'Article not found' });
    }

    if (title) article.title = title;
    if (description) article.description = description;
    if (category) article.category = category;
    if (author) article.author = author;
    if (image) article.image = image;

    saveNewsData();

    res.json({ 
        message: 'Article updated successfully', 
        article 
    });
});

// User data management
const usersFile = path.join(__dirname, 'users_data.json');
let usersData = [];

// Load users data
function loadUsersData() {
    try {
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            usersData = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading users data:', error);
        usersData = [];
    }
}

// Save users data
function saveUsersData() {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
    } catch (error) {
        console.error('Error saving users data:', error);
    }
}

// User registration endpoint
app.post('/api/users/register', (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username, email, and password are required' 
        });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username must be 3-20 characters' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters' 
        });
    }

    // Check if user exists
    if (usersData.find(u => u.username === username || u.email === email)) {
        return res.status(409).json({ 
            success: false, 
            message: 'Username or email already exists' 
        });
    }

    // Create new user
    const newUser = {
        id: uuidv4(),
        username,
        email,
        password: password, // In production, use bcrypt to hash password
        createdAt: new Date().toISOString()
    };

    usersData.push(newUser);
    saveUsersData();

    // Send welcome email
    sendWelcomeEmail(email, username);

    // Generate token (simple JWT-like token)
    const token = Buffer.from(`${newUser.id}:${newUser.username}`).toString('base64');

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        },
        token
    });
});

// User login endpoint
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        });
    }

    // Find user
    const user = usersData.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid username or password' 
        });
    }

    // Generate token
    const token = Buffer.from(`${user.id}:${user.username}`).toString('base64');

    // Send login notification email
    sendLoginNotificationEmail(user.email, user.username);

    res.json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token
    });
});

// Google OAuth endpoint (simplified - for production use proper OAuth2 flow)
app.post('/api/users/google-auth', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: 'Google token is required' 
        });
    }

    // In production, verify token with Google's API
    // For now, we'll extract email from the token payload (demo)
    try {
        // Decode the JWT token (simplified - doesn't verify signature)
        const parts = token.split('.');
        if (parts.length !== 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid token format' 
            });
        }

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        const email = payload.email;
        const name = payload.name || email.split('@')[0];

        // Check if user exists
        let user = usersData.find(u => u.email === email);

        if (!user) {
            // Create new user from Google data
            user = {
                id: uuidv4(),
                username: name.replace(/\s+/g, '_').toLowerCase(),
                email,
                password: '', // No password for OAuth users
                googleAuth: true,
                createdAt: new Date().toISOString()
            };
            usersData.push(user);
            saveUsersData();
        }

        // Generate token
        const authToken = Buffer.from(`${user.id}:${user.username}`).toString('base64');

        res.json({
            success: true,
            message: 'Google authentication successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token: authToken
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    loadNewsData();
    loadUsersData();
    console.log(`News server is running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log(`  GET  /api/news - Get all news`);
    console.log(`  GET  /api/news/category/:category - Get news by category`);
    console.log(`  POST /api/news - Add new news article`);
    console.log(`  PUT  /api/news/:id - Update news article`);
    console.log(`  DELETE /api/news/:id - Delete news article`);
    console.log(`  POST /api/users/register - Register new user`);
    console.log(`  POST /api/users/login - User login`);
    console.log(`  POST /api/users/google-auth - Google OAuth authentication`);
});
