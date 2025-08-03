// Admin Authentication
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const googleLoginBtn = document.getElementById('googleLogin');

    // Check if user is already logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Only allow admin email
            if (user.email === 'tahsan897@gmail.com') {
                window.location.href = 'admin.html';
            } else {
                // Logout non-admin users
                auth.signOut().then(() => {
                    showAlert('Access denied. Admin login required.', 'error');
                });
            }
        }
    });

    // Admin Email/Password Login
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate admin email
        if (email !== 'tahsan897@gmail.com') {
            showAlert('Access denied. Admin login required.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Double check admin email
                if (user.email === 'tahsan897@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    auth.signOut();
                    showAlert('Access denied. Admin login required.', 'error');
                }
            })
            .catch((error) => {
                console.error('Admin login error:', error);
                showAlert('Login failed: ' + error.message, 'error');
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });

    // Google Login for Admin
    googleLoginBtn.addEventListener('click', function() {
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                
                // Check if user is admin
                if (user.email === 'tahsan897@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    // Logout non-admin users
                    auth.signOut().then(() => {
                        showAlert('Access denied. Admin login required.', 'error');
                    });
                }
            })
            .catch((error) => {
                console.error('Google login error:', error);
                showAlert('Google login failed: ' + error.message, 'error');
            });
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
    const adminLoginForm = document.getElementById('adminLoginForm');
    adminLoginForm.parentNode.insertBefore(alert, adminLoginForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
} 