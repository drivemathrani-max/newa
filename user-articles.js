// User Article Management System

const API_URL = 'http://localhost:3000/api/news';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    setupEventListeners();
});

// Check user session
function checkUserSession() {
    const userSession = sessionStorage.getItem('userSession');
    
    if (!userSession) {
        // Not logged in - show login prompt
        document.getElementById('notLoggedIn').classList.remove('hidden');
        document.getElementById('articlesSection').classList.add('hidden');
        document.getElementById('userMenuContainer').classList.add('hidden');
    } else {
        // Logged in - show articles
        const user = JSON.parse(userSession);
        
        document.getElementById('notLoggedIn').classList.add('hidden');
        document.getElementById('articlesSection').classList.remove('hidden');
        document.getElementById('userMenuContainer').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = user.username;
        
        // Load user's articles
        loadUserArticles(user.userId);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    const searchInput = document.getElementById('searchArticles');
    const filterSelect = document.getElementById('filterCategory');
    
    if (searchInput) searchInput.addEventListener('input', filterArticles);
    if (filterSelect) filterSelect.addEventListener('change', filterArticles);

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Edit form
    const editForm = document.getElementById('editArticleForm');
    if (editForm) {
        editForm.addEventListener('submit', submitEditArticle);
    }

    // Character counters for edit form
    const titleInput = document.getElementById('editTitle');
    const descInput = document.getElementById('editDescription');
    
    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            document.getElementById('editTitleCount').textContent = e.target.value.length;
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            document.getElementById('editDescCount').textContent = e.target.value.length;
        });
    }
}

// Load user's articles
function loadUserArticles(userId) {
    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            // Filter articles by userId or author username (case-insensitive)
            const userSession = JSON.parse(sessionStorage.getItem('userSession'));
            console.log('Loading articles for user:', userSession.username, 'UserId:', userSession.userId, 'Total articles:', articles.length);
            console.log('Articles:', articles);
            const userArticles = articles.filter(a => 
                a.userId === userSession.userId || 
                (a.author && a.author.toLowerCase() === userSession.username.toLowerCase())
            );
            console.log('Filtered articles count:', userArticles.length, 'User articles:', userArticles);
            displayUserArticles(userArticles);
            updateStatistics(userArticles);
            updateArticlesBadge(userArticles.length);
        })
        .catch(error => {
            console.error('Error loading articles:', error);
            document.getElementById('userArticlesList').innerHTML = '<p class="error-message">Error loading articles</p>';
        });
}

// Display user articles
function displayUserArticles(articles) {
    console.log('Displaying articles:', articles.length);
    const list = document.getElementById('userArticlesList');
    const noArticles = document.getElementById('noArticles');

    if (articles.length === 0) {
        console.log('No articles found, showing empty state');
        list.classList.add('hidden');
        noArticles.classList.remove('hidden');
        return;
    }

    list.classList.remove('hidden');
    noArticles.classList.add('hidden');
    list.innerHTML = '';
    console.log('Rendering', articles.length, 'articles...');

    articles.forEach(article => {
        console.log('Creating article element for:', article.title);
        const item = document.createElement('div');
        item.className = 'article-item';
        
        // Check if user is admin to show edit/delete buttons
        const isAdmin = sessionStorage.getItem('adminSession');
        const canDelete = !isAdmin || (isAdmin && article.userId === JSON.parse(sessionStorage.getItem('userSession')).userId);
        const actionButtons = canDelete ? `
            <div class="article-actions">
                <button class="btn-edit" onclick="editArticle('${article.id}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteArticle('${article.id}', this)">🗑️ Delete</button>
            </div>
        ` : '<div class="article-actions" style="visibility: hidden; height: 0;"></div>';
        
        item.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="article-thumbnail" onerror="this.src='https://via.placeholder.com/100x80?text=No+Image'">
            <div class="article-info">
                <h3>${article.title}</h3>
                <div class="article-meta">
                    <span class="category-badge" style="background-color: ${getCategoryColor(article.category)}">${capitalize(article.category)}</span>
                    <span>📅 ${article.date}</span>
                </div>
                <p class="article-desc">${article.description.substring(0, 100)}...</p>
            </div>
            ${actionButtons}
        `;
        list.appendChild(item);
        console.log('Article element added to DOM');
    });
}

// Filter articles
function filterArticles() {
    const searchInput = document.getElementById('searchArticles').value.trim().toLowerCase();
    const filterSelect = document.getElementById('filterCategory').value;
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            let userArticles = articles.filter(a => 
                a.userId === userSession.userId || 
                (a.author && a.author.toLowerCase() === userSession.username.toLowerCase())
            );
            if (searchInput) {
                userArticles = userArticles.filter(a =>
                    a.title.toLowerCase().includes(searchInput) ||
                    a.description.toLowerCase().includes(searchInput)
                );
            }
            if (filterSelect) {
                userArticles = userArticles.filter(a => a.category === filterSelect);
            }
            displayUserArticles(userArticles);
            updateStatistics(userArticles);
            updateArticlesBadge(userArticles.length);
        })
        .catch(error => {
            console.error('Error filtering articles:', error);
        });
}

// Update statistics
function updateStatistics(articles) {
    document.getElementById('totalArticles').textContent = articles.length;
    document.getElementById('techCount').textContent = articles.filter(a => a.category === 'tech').length;
    document.getElementById('businessCount').textContent = articles.filter(a => a.category === 'business').length;
    document.getElementById('sportsCount').textContent = articles.filter(a => a.category === 'sports').length;
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

// Edit article
function editArticle(articleId) {
    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            const article = articles.find(a => a.id === articleId);
            if (article) {
                showEditForm(article);
            } else {
                alert('Article not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading article');
        });
}

// Show edit form
function showEditForm(article) {
    document.getElementById('editArticleForm').dataset.articleId = article.id;
    
    document.getElementById('editTitle').value = article.title;
    document.getElementById('editCategory').value = article.category;
    document.getElementById('editDescription').value = article.description;
    document.getElementById('editImage').value = article.image || '';
    
    document.getElementById('editTitleCount').textContent = article.title.length;
    document.getElementById('editDescCount').textContent = article.description.length;
    
    document.getElementById('editModal').classList.remove('hidden');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editArticleForm').reset();
    document.getElementById('editMessage').textContent = '';
    document.getElementById('editMessage').className = 'form-message';
}

// Submit edit
function submitEditArticle(e) {
    e.preventDefault();

    const articleId = document.getElementById('editArticleForm').dataset.articleId;
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const category = document.getElementById('editCategory').value;
    const image = document.getElementById('editImage').value.trim();
    const message = document.getElementById('editMessage');

    // Validation
    if (!title || !description || !category) {
        message.textContent = '✗ Please fill all required fields.';
        message.className = 'form-message error';
        return;
    }

    if (description.length < 50) {
        message.textContent = '✗ Description must be at least 50 characters.';
        message.className = 'form-message error';
        return;
    }

    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    const updatedArticle = {
        title,
        description,
        category,
        author: userSession.username,
        image: image || undefined
    };

    fetch(`${API_URL}/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArticle)
    })
    .then(response => response.json())
    .then(data => {
        message.textContent = '✓ Article updated successfully!';
        message.className = 'form-message success';
        
        setTimeout(() => {
            closeEditModal();
            loadUserArticles(userSession.userId);
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
        message.textContent = '✗ Error updating article.';
        message.className = 'form-message error';
    });
}

// Delete article
function deleteArticle(articleId, buttonElement) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }
    buttonElement.disabled = true;
    buttonElement.textContent = '⏳ Deleting...';
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    fetch(`${API_URL}/${articleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userSession.userId })
    })
    .then(response => response.json())
    .then(data => {
        loadUserArticles(userSession.userId);
    })
    .catch(error => {
        console.error('Error:', error);
        buttonElement.disabled = false;
        buttonElement.textContent = '🗑️ Delete';
        alert('Error deleting article.');
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }
}

// Get category color
function getCategoryColor(category) {
    const colors = {
        tech: '#3b82f6',
        business: '#f59e0b',
        sports: '#ef4444',
        health: '#10b981'
    };
    return colors[category] || '#6366f1';
}

// Capitalize function
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
