// API Base URL
const API_URL = 'http://localhost:3000/api/news';

let newsData = [];
let currentFilter = 'all';

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    loadNews();
    setupFormHandler();
    loadFeaturedArticle(); 
});

// Check user session and manage navbar
function checkUserSession() {
    const userSession = sessionStorage.getItem('userSession');
    const userMenuContainer = document.getElementById('userMenuContainer');
    
    if (userMenuContainer) {
        if (userSession) {
            // User is logged in - show menu
            const user = JSON.parse(userSession);
            const userDisplay = userMenuContainer.querySelector('#userDisplay');
            if (userDisplay) {
                userDisplay.textContent = user.username;
            }
            userMenuContainer.classList.remove('hidden');
            
            // Setup logout button
            const logoutBtn = userMenuContainer.querySelector('#logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
            
            // Load and show articles badge
            loadUserArticlesCount(user);
        } else {
            // User is not logged in - hide menu
            userMenuContainer.classList.add('hidden');
        }
    }
}

// Load user articles count for badge
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
        let badge = myArticlesLink.querySelector('.article-count-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'article-count-badge';
            myArticlesLink.appendChild(badge);
        }
        badge.textContent = count;
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    }
}

// Setup form submission handler
function setupFormHandler() {
    const form = document.getElementById('addNewsForm');
    if (form) {
        form.addEventListener('submit', handleAddNews);
    }
}

// Load and display news articles
function loadNews() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            return response.json();
        })
        .then(data => {
            newsData = data;
            displayNews();
        })
        .catch(error => {
            console.error('Error loading news:', error);
            showFormMessage('Error loading news. Please refresh the page.', 'error');
        });
}

// Featured carousel state
let featuredArticles = [];
let currentFeaturedIndex = 0;
let carouselAutoPlayInterval;

// Load and display featured articles carousel
function loadFeaturedArticle() {
    fetch(API_URL)
        .then(response => response.json())
        .then(articles => {
            featuredArticles = articles.filter(a => a.featured === true);
            if (featuredArticles.length > 0) {
                displayFeaturedArticle(0);
                setupCarousel();
                if (featuredArticles.length > 1) {
                    startCarouselAutoPlay();
                }
            } else {
                // Hide carousel if no featured articles
                const featuredSection = document.querySelector('.featured');
                if (featuredSection) {
                    featuredSection.style.display = 'none';
                }
            }
        })
        .catch(error => console.error('Error loading featured article:', error));
}

// Display a featured article by index
function displayFeaturedArticle(index) {
    if (featuredArticles.length === 0) return;
    
    const article = featuredArticles[index];
    const container = document.getElementById('featuredCarouselContainer');
    
    if (container) {
        container.innerHTML = `
            <article class="featured-article">
                <img src="${article.image || 'https://via.placeholder.com/1200x400?text=Featured+News'}" alt="${article.title}">
                <div class="featured-content">
                    <span class="category">${article.category || ''}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <span class="author">By ${article.author}</span>
                </div>
            </article>
        `;
    }
    
    // Update indicators
    updateCarouselIndicators(index);
}

// Setup carousel controls
function setupCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(carouselAutoPlayInterval);
            currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredArticles.length) % featuredArticles.length;
            displayFeaturedArticle(currentFeaturedIndex);
            startCarouselAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(carouselAutoPlayInterval);
            currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredArticles.length;
            displayFeaturedArticle(currentFeaturedIndex);
            startCarouselAutoPlay();
        });
    }
    
    // Create indicators (removed - badges removed to toggle between articles)
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
    }
}

// Auto-play carousel every 5 seconds
function startCarouselAutoPlay() {
    carouselAutoPlayInterval = setInterval(() => {
        currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredArticles.length;
        displayFeaturedArticle(currentFeaturedIndex);
    }, 5000);
}

// Update carousel indicators (removed)
function updateCarouselIndicators(index) {
    // Indicators removed - no badges to toggle between articles
}

// Display news based on current filter
function displayNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    newsGrid.innerHTML = '';

    const filteredNews = currentFilter === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === currentFilter);

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No news found in this category.</p>';
        return;
    }

    filteredNews.forEach(article => {
        const newsCard = createNewsCard(article);
        newsGrid.appendChild(newsCard);
    });
}

// Create a news card element
function createNewsCard(article) {
    const card = document.createElement('article');
    card.className = 'news-card fade-in';
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="news-card-image">
        <div class="news-card-content">
            <span class="category" style="background-color: ${getCategoryColor(article.category)}">
                ${capitalize(article.category)}
            </span>
            <h4>${article.title}</h4>
            <p>${article.description}</p>
            <div class="news-card-footer">
                <span class="author">by ${article.author}</span>
                <span class="date">${article.date}</span>
            </div>
        </div>
    `;
    return card;
}

// Filter news by category
function filterNews(category) {
    currentFilter = category;
    displayNews();
}

// Handle adding new news
function handleAddNews(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const author = document.getElementById('author').value.trim();
    const image = document.getElementById('image').value.trim();

    // Validation
    if (description.length < 20) {
        showFormMessage('Description must be at least 20 characters long.', 'error');
        return;
    }

    const newArticle = {
        title,
        description,
        category,
        author,
        image: image || undefined
    };

    // Send to server
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArticle)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add news');
        }
        return response.json();
    })
    .then(data => {
        showFormMessage('✓ News article posted successfully!', 'success');
        document.getElementById('addNewsForm').reset();
        setTimeout(() => {
            loadNews();
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        showFormMessage('Error posting news. Please try again.', 'error');
    });
}

// Show form message
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        setTimeout(() => {
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

// Get color for category badge
function getCategoryColor(category) {
    const colors = {
        tech: '#e94560',
        business: '#3498db',
        sports: '#2ecc71',
        health: '#9b59b6',
        all: '#e94560'
    };
    return colors[category] || '#e94560';
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
