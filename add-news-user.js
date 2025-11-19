// User Article Submission System

const API_URL = 'http://localhost:3000/api/articles';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    setupEventListeners();
    setupThemeToggle();
});

// Check user session and populate form
function checkUserSession() {
    const userSession = sessionStorage.getItem('userSession');
    
    if (!userSession) {
        // Not logged in - show login prompt
        document.getElementById('notLoggedIn').classList.remove('hidden');
        document.getElementById('submitSection').classList.add('hidden');
    } else {
        // Logged in - show submit form
        const user = JSON.parse(userSession);
        
        document.getElementById('notLoggedIn').classList.add('hidden');
        document.getElementById('submitSection').classList.remove('hidden');
        document.getElementById('userDisplay').textContent = user.username;
        document.getElementById('authorDisplay').value = user.username;
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

    // Image upload
    const imageInput = document.getElementById('articleImage');
    const uploadArea = document.querySelector('.upload-area');
    
    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelect);
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--accent-color)';
            uploadArea.style.backgroundColor = 'rgba(233, 69, 96, 0.05)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.backgroundColor = 'transparent';
            
            if (e.dataTransfer.files.length > 0) {
                imageInput.files = e.dataTransfer.files;
                handleImageSelect();
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle image selection
function handleImageSelect() {
    const imageInput = document.getElementById('articleImage');
    const file = imageInput.files[0];

    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showSubmitMessage('✗ Please upload JPEG, PNG, or WebP image', 'error');
        imageInput.value = '';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showSubmitMessage('✗ Image must be less than 5MB', 'error');
        imageInput.value = '';
        return;
    }

    // Read and display preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        previewImage.src = e.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// Remove image
function removeImage() {
    document.getElementById('articleImage').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
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

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('userId', user.userId);

    // Add image if selected
    const imageFile = document.getElementById('articleImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            formData.append('image', e.target.result);
            submitArticleToServer(formData, user);
        };
        reader.readAsDataURL(imageFile);
    } else {
        submitArticleToServer(formData, user);
    }
}

// Submit article to server
function submitArticleToServer(formData, user) {
    // Convert FormData to JSON
    const articleData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        author: formData.get('author'),
        userId: formData.get('userId'),
        image: formData.get('image') || undefined
    };

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
        if (data.success || data.id) {
            showSubmitMessage('✓ Article published successfully!', 'success');
            
            // Clear form
            document.getElementById('submitArticleForm').reset();
            document.getElementById('titleCount').textContent = '0';
            document.getElementById('descCount').textContent = '0';
            document.getElementById('imagePreview').classList.add('hidden');
            
            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
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

// Setup theme toggle
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}
