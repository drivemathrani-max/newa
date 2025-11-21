// User Article Submission System

const API_URL = 'http://localhost:3000/api/news';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    setupEventListeners();
});

// Check user session and populate form
function checkUserSession() {
    const userSession = sessionStorage.getItem('userSession');
    const adminSession = sessionStorage.getItem('adminSession');
    
    if (!userSession && !adminSession) {
        // Not logged in - show login prompt
        document.getElementById('notLoggedIn').classList.remove('hidden');
        document.getElementById('submitSection').classList.add('hidden');
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('userMenuContainer').classList.add('hidden');
    } else if (userSession) {
        // Any logged-in user (admin or regular) can submit articles
        const user = JSON.parse(userSession);
        
        document.getElementById('notLoggedIn').classList.add('hidden');
        document.getElementById('submitSection').classList.remove('hidden');
        document.getElementById('userSection').classList.add('hidden');
        document.getElementById('userMenuContainer').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = user.username || 'Admin';
        
        // Load and show articles badge
        loadUserArticlesCount(user);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Article form
    const form = document.getElementById('submitArticleForm');
    if (form) {
        form.addEventListener('submit', handleSubmitArticle);
    }

    // Character counters
    const titleInput = document.getElementById('articleTitle');
    const descInput = document.getElementById('articleDescription');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            document.getElementById('titleCount').textContent = e.target.value.length;
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            document.getElementById('descCount').textContent = e.target.value.length;
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Load user articles count and show badge
function loadUserArticlesCount(user) {
    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            const userArticles = articles.filter(a => 
                a.userId === user.userId || 
                (a.author && a.author.toLowerCase() === user.username.toLowerCase())
            );
            updateArticlesBadge(userArticles.length);
        })
        .catch(error => console.error('Error loading articles count:', error));
}

// Update articles badge in navigation
function updateArticlesBadge(count) {
    const myArticlesLink = document.querySelector('nav a[href="user-articles.html"]');
    if (myArticlesLink && count > 0) {
        // Check if badge already exists
        let badge = myArticlesLink.querySelector('.article-count-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'article-count-badge';
            myArticlesLink.appendChild(badge);
        }
        badge.textContent = count;
    }
}

// Handle article submission
function handleSubmitArticle(e) {
    e.preventDefault();

    const userSession = sessionStorage.getItem('userSession');
    if (!userSession) {
        showSubmitMessage('✗ User session expired. Please login again.', 'error');
        return;
    }

    const user = JSON.parse(userSession);
    const title = document.getElementById('articleTitle').value.trim();
    const description = document.getElementById('articleDescription').value.trim();
    const category = document.getElementById('articleCategory').value;
    const imageUrl = document.getElementById('articleImage').value.trim();
    const author = user.username;

    // Validation
    if (!title || !description || !category) {
        showSubmitMessage('✗ Please fill all required fields', 'error');
        return;
    }

    if (description.length < 50) {
        showSubmitMessage('✗ Description must be at least 50 characters', 'error');
        return;
    }

    // Prepare article data
    const articleData = {
        title,
        description,
        category,
        author,
        userId: user.userId,
        image: imageUrl || undefined
    };

    submitArticleToServer(articleData, user);
}

// Submit article to server
function submitArticleToServer(articleData, user) {
    fetch(API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(articleData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.article || data.message) {
            showSubmitMessage('✓ Article published successfully!', 'success');
            
            // Clear form
            document.getElementById('submitArticleForm').reset();
            document.getElementById('titleCount').textContent = '0';
            document.getElementById('descCount').textContent = '0';
            
            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else if (data.error) {
            showSubmitMessage(`✗ ${data.error}`, 'error');
        } else {
            showSubmitMessage(`✗ ${data.message || 'Failed to publish article'}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showSubmitMessage('✗ Error publishing article. Please try again.', 'error');
    });
}

// Show submit message
function showSubmitMessage(text, type) {
    const message = document.getElementById('submitMessage');
    message.textContent = text;
    message.className = `submit-message ${type}`;
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }
}
