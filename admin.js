// Admin Panel JavaScript
const API_URL = 'http://localhost:3000/api/news';
const DEFAULT_PASSWORD = 'admin123'; // Change this in production!

let isLoggedIn = false;
let adminPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
    setupThemeToggle();
});

// Check if admin is already logged in
function checkLoginStatus() {
    const sessionToken = sessionStorage.getItem('adminSession');
    if (sessionToken) {
        isLoggedIn = true;
        showDashboard();
        loadArticles();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    const navItems = document.querySelectorAll('.admin-nav-item:not(.logout-btn)');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Add article form
    const addForm = document.getElementById('adminAddForm');
    if (addForm) {
        addForm.addEventListener('submit', handleAddArticle);
    }

    // Character counters
    const titleInput = document.getElementById('adminTitle');
    const descInput = document.getElementById('adminDescription');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            document.getElementById('adminTitleCount').textContent = e.target.value.length;
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            document.getElementById('adminDescCount').textContent = e.target.value.length;
        });
    }

    // Search and filter
    const searchInput = document.getElementById('searchArticles');
    const filterSelect = document.getElementById('filterCategory');
    
    if (searchInput) searchInput.addEventListener('input', filterArticles);
    if (filterSelect) filterSelect.addEventListener('change', filterArticles);

    // Password change form
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const message = document.getElementById('loginMessage');

    if (password === adminPassword) {
        // Create session
        sessionStorage.setItem('adminSession', 'true');
        isLoggedIn = true;
        
        message.textContent = '✓ Login successful! Redirecting...';
        message.className = 'login-message success';
        
        setTimeout(() => {
            showDashboard();
            loadArticles();
            document.getElementById('adminPassword').value = '';
        }, 1000);
    } else {
        message.textContent = '✗ Invalid password. Please try again.';
        message.className = 'login-message error';
        document.getElementById('adminPassword').value = '';
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminSession');
        isLoggedIn = false;
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('loginSection').classList.remove('hidden');
        document.getElementById('adminPassword').value = '';
    }
}

// Handle navigation
function handleNavigation(e) {
    const section = e.target.getAttribute('data-section');
    
    // Update active nav item
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');

    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    if (section === 'articles') {
        document.getElementById('articlesSection').classList.add('active');
    } else if (section === 'add-article') {
        document.getElementById('addArticleSection').classList.add('active');
    } else if (section === 'settings') {
        document.getElementById('settingsSection').classList.add('active');
    }
}

// Load all articles
function loadArticles() {
    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            displayArticles(articles);
            updateStatistics(articles);
        })
        .catch(error => console.error('Error loading articles:', error));
}

// Display articles in list
function displayArticles(articles) {
    const list = document.getElementById('adminArticlesList');
    list.innerHTML = '';

    if (articles.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const item = document.createElement('div');
        item.className = 'article-item';
        item.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="article-thumbnail" onerror="this.src='https://via.placeholder.com/100x80?text=No+Image'">
            <div class="article-info">
                <h3>${article.title}</h3>
                <div class="article-meta">
                    <span>📝 ${article.author}</span>
                    <span>📂 ${capitalize(article.category)}</span>
                    <span>📅 ${article.date}</span>
                </div>
                <p class="article-desc">${article.description.substring(0, 80)}...</p>
            </div>
            <div class="article-actions">
                <button class="btn-edit" onclick="editArticle('${article.id}')">✏️ Edit</button>
                <button class="btn-admin-delete" onclick="adminDeleteArticle('${article.id}', this)">🗑️ Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Filter articles
function filterArticles() {
    const search = document.getElementById('searchArticles').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;

    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            const filtered = articles.filter(article => {
                const matchesSearch = article.title.toLowerCase().includes(search) || 
                                    article.author.toLowerCase().includes(search);
                const matchesCategory = !category || article.category === category;
                return matchesSearch && matchesCategory;
            });
            displayArticles(filtered);
        });
}

// Update statistics
function updateStatistics(articles) {
    document.getElementById('totalArticles').textContent = articles.length;
    document.getElementById('techCount').textContent = articles.filter(a => a.category === 'tech').length;
    document.getElementById('businessCount').textContent = articles.filter(a => a.category === 'business').length;
    document.getElementById('sportsCount').textContent = articles.filter(a => a.category === 'sports').length;
    document.getElementById('dbTotalArticles').textContent = articles.length;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
}

// Handle add article
function handleAddArticle(e) {
    e.preventDefault();

    const title = document.getElementById('adminTitle').value.trim();
    const description = document.getElementById('adminDescription').value.trim();
    const category = document.getElementById('adminCategory').value;
    const author = document.getElementById('adminAuthor').value.trim();
    const image = document.getElementById('adminImage').value.trim();

    const message = document.getElementById('adminFormMessage');

    // Validation
    if (!title || !description || !category || !author) {
        message.textContent = '✗ Please fill all required fields.';
        message.className = 'form-message error';
        return;
    }

    if (description.length < 50) {
        message.textContent = '✗ Description must be at least 50 characters.';
        message.className = 'form-message error';
        return;
    }

    const newArticle = {
        title,
        description,
        category,
        author,
        image: image || undefined
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
    })
    .then(response => response.json())
    .then(data => {
        message.textContent = '✓ Article published successfully!';
        message.className = 'form-message success';
        
        document.getElementById('adminAddForm').reset();
        document.getElementById('adminTitleCount').textContent = '0';
        document.getElementById('adminDescCount').textContent = '0';
        
        setTimeout(() => {
            loadArticles();
            document.querySelector('[data-section="articles"]').click();
        }, 1500);
    })
    .catch(error => {
        message.textContent = '✗ Error publishing article.';
        message.className = 'form-message error';
    });
}

// Admin delete article
function adminDeleteArticle(articleId, buttonElement) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }

    buttonElement.disabled = true;
    buttonElement.textContent = '⏳ Deleting...';

    fetch(`${API_URL}/${articleId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        loadArticles();
    })
    .catch(error => {
        console.error('Error:', error);
        buttonElement.disabled = false;
        buttonElement.textContent = '🗑️ Delete';
        alert('Error deleting article.');
    });
}

// Edit article (placeholder)
function editArticle(articleId) {
    alert('Edit functionality coming soon!');
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('passwordMessage');

    if (currentPassword !== adminPassword) {
        message.textContent = '✗ Current password is incorrect.';
        message.className = 'form-message error';
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = '✗ New passwords do not match.';
        message.className = 'form-message error';
        return;
    }

    if (newPassword.length < 6) {
        message.textContent = '✗ New password must be at least 6 characters.';
        message.className = 'form-message error';
        return;
    }

    // Update password
    adminPassword = newPassword;
    localStorage.setItem('adminPassword', adminPassword);

    message.textContent = '✓ Password changed successfully!';
    message.className = 'form-message success';

    document.getElementById('changePasswordForm').reset();
    setTimeout(() => {
        message.className = 'form-message';
    }, 5000);
}

// Setup theme toggle
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

// Capitalize function
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
