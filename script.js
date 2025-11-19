// API Base URL
const API_URL = 'http://localhost:3000/api/news';

let newsData = [];
let currentFilter = 'all';

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    setupFormHandler();
});

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

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
