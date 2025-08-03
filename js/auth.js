// User Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLogin');
    const registerLink = document.getElementById('registerLink');

    // Check if user is already logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Check if user is admin
            if (user.email === 'tahsan897@gmail.com') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'main.html';
            }
        }
    });

    // Email/Password Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Check if user is admin
                if (user.email === 'tahsan897@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'main.html';
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                showAlert('Login failed: ' + error.message, 'error');
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });

    // Google Login
    googleLoginBtn.addEventListener('click', function() {
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                
                // Check if user is admin
                if (user.email === 'tahsan897@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'main.html';
                }
            })
            .catch((error) => {
                console.error('Google login error:', error);
                showAlert('Google login failed: ' + error.message, 'error');
            });
    });

    // Register Link (for future implementation)
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAlert('Registration feature coming soon!', 'warning');
    });
});

// Helper function to show alerts
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert alert before the login form
    const loginForm = document.getElementById('loginForm');
    loginForm.parentNode.insertBefore(alert, loginForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
} 