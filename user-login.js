// User Login System with Google OAuth

const API_URL = 'http://localhost:3000/api/users';
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google Client ID

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupThemeToggle();
    checkUserSession();
    initializeGoogleAuth();
});

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('userLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleUserLogin);
    }

    // Signup form
    const signupForm = document.getElementById('userSignupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleUserSignup);
    }

    // Username input for real-time validation
    const usernameInput = document.getElementById('signupUsername');
    if (usernameInput) {
        usernameInput.addEventListener('input', validateUsername);
    }
}

// Toggle between login and signup
function toggleAuthMode(e) {
    e.preventDefault();
    document.getElementById('loginContainer').classList.toggle('hidden');
    document.getElementById('signupContainer').classList.toggle('hidden');
    
    // Clear messages
    clearMessages();
}

// Clear all messages
function clearMessages() {
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('loginMessage').className = 'auth-message';
    document.getElementById('signupMessage').textContent = '';
    document.getElementById('signupMessage').className = 'auth-message';
}

// Validate username
function validateUsername(e) {
    const username = e.target.value;
    const hint = document.getElementById('usernameHint');
    
    if (username.length < 3) {
        hint.textContent = '❌ Username must be at least 3 characters';
        hint.style.color = '#dc2626';
    } else if (username.length > 20) {
        hint.textContent = '❌ Username must be less than 20 characters';
        hint.style.color = '#dc2626';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        hint.textContent = '❌ Username can only contain letters, numbers, underscores, and hyphens';
        hint.style.color = '#dc2626';
    } else {
        hint.textContent = '✓ Username looks good!';
        hint.style.color = '#16a34a';
    }
}

// Handle user login
function handleUserLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    if (!username || !password) {
        showMessage(message, 'Please enter username and password', 'error');
        return;
    }

    // Simulate login request
    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store user session
            sessionStorage.setItem('userSession', JSON.stringify({
                username: data.user.username,
                email: data.user.email,
                userId: data.user.id,
                token: data.token
            }));

            showMessage(message, '✓ Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'add-news.html';
            }, 1500);
        } else {
            showMessage(message, `✗ ${data.message || 'Login failed'}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(message, '✗ Connection error. Please try again.', 'error');
    });
}

// Handle user signup
function handleUserSignup(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const message = document.getElementById('signupMessage');

    // Validation
    if (!username || !email || !password || !confirm) {
        showMessage(message, 'Please fill all fields', 'error');
        return;
    }

    if (username.length < 3 || username.length > 20) {
        showMessage(message, 'Username must be 3-20 characters', 'error');
        return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showMessage(message, 'Username can only contain letters, numbers, underscores, and hyphens', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(message, 'Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirm) {
        showMessage(message, 'Passwords do not match', 'error');
        return;
    }

    // Signup request
    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(message, '✓ Account created! Logging in...', 'success');
            
            setTimeout(() => {
                // Automatically login after signup
                sessionStorage.setItem('userSession', JSON.stringify({
                    username: data.user.username,
                    email: data.user.email,
                    userId: data.user.id,
                    token: data.token
                }));
                window.location.href = 'add-news.html';
            }, 1500);
        } else {
            showMessage(message, `✗ ${data.message || 'Signup failed'}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(message, '✗ Connection error. Please try again.', 'error');
    });
}

// Show message
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `auth-message ${type}`;
}

// Initialize Google OAuth
function initializeGoogleAuth() {
    // Check if Google library is loaded
    if (window.google && window.google.accounts) {
        // Login button
        google.accounts.id.renderButton(
            document.getElementById('googleLoginButton'),
            {
                type: 'standard',
                theme: document.documentElement.classList.contains('theme-dark') ? 'filled_black' : 'outline',
                size: 'large',
                locale: 'en_US',
                text: 'signin'
            }
        );

        // Signup button
        google.accounts.id.renderButton(
            document.getElementById('googleSignupButton'),
            {
                type: 'standard',
                theme: document.documentElement.classList.contains('theme-dark') ? 'filled_black' : 'outline',
                size: 'large',
                locale: 'en_US',
                text: 'signup'
            }
        );

        // Handle response
        google.accounts.id.oneTapClose(() => {
            console.log('One tap closed');
        });

        // Set callback
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleAuth
        });
    } else {
        console.log('Google Sign-In library not loaded yet');
    }
}

// Handle Google OAuth response
function handleGoogleAuth(response) {
    if (response.credential) {
        // Send token to backend for verification
        fetch(`${API_URL}/google-auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Store user session
                sessionStorage.setItem('userSession', JSON.stringify({
                    username: data.user.username,
                    email: data.user.email,
                    userId: data.user.id,
                    token: data.token,
                    googleAuth: true
                }));

                const message = document.getElementById('loginMessage');
                showMessage(message, '✓ Google login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'add-news.html';
                }, 1500);
            } else {
                const message = document.getElementById('loginMessage');
                showMessage(message, `✗ ${data.message || 'Google auth failed'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const message = document.getElementById('loginMessage');
            showMessage(message, '✗ Google authentication failed', 'error');
        });
    }
}

// Check if user is already logged in
function checkUserSession() {
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
        // User already logged in, redirect to add-news
        window.location.href = 'add-news.html';
    }
}

// Setup theme toggle
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}
