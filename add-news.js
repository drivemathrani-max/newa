// API Base URL
const API_URL = 'http://localhost:3000/api/news';

// Store uploaded image
let uploadedImageData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupFormHandler();
    setupCharacterCounters();
    setupImagePreview();
    setupFileUpload();
    setupTabNavigation();
});

// Setup form submission
function setupFormHandler() {
    const form = document.getElementById('addNewsForm');
    if (form) {
        form.addEventListener('submit', handleAddNews);
    }
}

// Setup real-time character counters
function setupCharacterCounters() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            document.getElementById('titleCount').textContent = e.target.value.length;
        });
    }

    if (descriptionInput) {
        descriptionInput.addEventListener('input', (e) => {
            document.getElementById('descCount').textContent = e.target.value.length;
        });
    }
}

// Setup image preview
function setupImagePreview() {
    const imageInput = document.getElementById('image');
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const url = e.target.value.trim();
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');

            if (url) {
                previewImg.src = url;
                previewImg.onload = () => {
                    preview.classList.remove('hidden');
                };
                previewImg.onerror = () => {
                    preview.classList.add('hidden');
                    showFormMessage('Invalid image URL. Please check the URL and try again.', 'error');
                };
            } else {
                preview.classList.add('hidden');
            }
        });
    }
}

// Setup file upload
function setupFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageFile');

    if (!dropZone || !fileInput) return;

    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showFileInfo('❌ Invalid file type. Please upload JPG, PNG, GIF, or WebP.', 'error');
        return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showFileInfo('❌ File size exceeds 5MB limit.', 'error');
        return;
    }

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageData = e.target.result;
        showFileInfo(`✓ ${file.name} (${formatFileSize(file.size)})`, 'success');
        showImagePreview(uploadedImageData);
    };
    reader.onerror = () => {
        showFileInfo('❌ Error reading file.', 'error');
    };

    reader.readAsDataURL(file);
}

// Show file info message
function showFileInfo(message, type) {
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
        fileInfo.innerHTML = `<span class="file-info-text">${message}</span>`;
        fileInfo.className = `file-info ${type === 'error' ? 'error' : ''}`;
        fileInfo.classList.remove('hidden');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Show image preview
function showImagePreview(imageSrc) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    previewImg.src = imageSrc;
    preview.classList.remove('hidden');
}

// Remove image
function removeImage() {
    uploadedImageData = null;
    document.getElementById('imageFile').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('fileInfo').classList.add('hidden');
    showFormMessage('Image removed.', 'success');
}

// Setup tab navigation
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Switch between upload and URL tabs
function switchTab(tabName) {
    const uploadTab = document.getElementById('uploadTab');
    const urlTab = document.getElementById('urlTab');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Update active tab button
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // Show/hide tabs
    if (tabName === 'upload') {
        uploadTab.classList.add('active');
        urlTab.classList.remove('active');
        urlTab.classList.add('hidden');
    } else {
        urlTab.classList.add('active');
        uploadTab.classList.remove('active');
        uploadTab.classList.add('hidden');
    }
}

// Handle adding new news
function handleAddNews(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const author = document.getElementById('author').value.trim();
    const imageUrl = document.getElementById('image').value.trim();

    // Validation
    if (!title) {
        showFormMessage('Please enter an article title.', 'error');
        return;
    }

    if (!author) {
        showFormMessage('Please enter your name.', 'error');
        return;
    }

    if (!category) {
        showFormMessage('Please select a category.', 'error');
        return;
    }

    if (description.length < 50) {
        showFormMessage('Description must be at least 50 characters long.', 'error');
        return;
    }

    // Determine image source
    let imageToUse = uploadedImageData || imageUrl || undefined;

    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Publishing...';

    const newArticle = {
        title,
        description,
        category,
        author,
        image: imageToUse
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
        
        // Reset form
        document.getElementById('addNewsForm').reset();
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('fileInfo').classList.add('hidden');
        document.getElementById('titleCount').textContent = '0';
        document.getElementById('descCount').textContent = '0';
        uploadedImageData = null;
        
        // Show success modal and redirect
        setTimeout(() => {
            showSuccessModal();
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
        showFormMessage('❌ Error posting news. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Show form message
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds for success/error
        if (type !== 'loading') {
            setTimeout(() => {
                messageDiv.className = 'form-message';
            }, 5000);
        }
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Show success modal
function showSuccessModal() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('hidden');
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }
}

// Filter news function (for header navigation)
function filterNews(category) {
    window.location.href = `index.html?category=${category}`;
}
