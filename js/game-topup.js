// Game Top-up JavaScript
let currentUser = null;
let selectedPackage = null;
let selectedAmount = 0;
let currentGame = '';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Check if user is admin
            if (user.email === 'tahsan897@gmail.com') {
                window.location.href = 'admin.html';
                return;
            }
            
            currentUser = user;
            loadUserData();
            loadWalletBalance();
            
            // Determine current game from URL
            const path = window.location.pathname;
            if (path.includes('freefire')) {
                currentGame = 'Free Fire';
            } else if (path.includes('pubg')) {
                currentGame = 'PUBG Mobile';
            } else if (path.includes('mobilelegends')) {
                currentGame = 'Mobile Legends';
            } else if (path.includes('minecraft')) {
                currentGame = 'Minecraft';
            } else if (path.includes('valorant')) {
                currentGame = 'Valorant';
            } else if (path.includes('roblox')) {
                currentGame = 'Roblox';
            }
        } else {
            window.location.href = 'index.html';
        }
    });

    // Top-up form
    const topupForm = document.getElementById('topupForm');
    if (topupForm) {
        topupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
});

// Load user data
function loadUserData() {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhoto = document.getElementById('userPhoto');

    if (currentUser) {
        userName.textContent = currentUser.displayName || 'User';
        userEmail.textContent = currentUser.email;
        
        if (currentUser.photoURL) {
            userPhoto.src = currentUser.photoURL;
        }
    }
}

// Load wallet balance
function loadWalletBalance() {
    if (!currentUser) return;

    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const balance = doc.data().walletBalance || 0;
                // Update wallet balance display if it exists
                const walletBalanceElement = document.getElementById('walletBalance');
                if (walletBalanceElement) {
                    walletBalanceElement.textContent = `৳${balance}`;
                }
            }
        })
        .catch((error) => {
            console.error('Error loading wallet:', error);
        });
}

// Select package
function selectPackage(packageName, amount) {
    selectedPackage = packageName;
    selectedAmount = amount;
    
    // Update form fields
    document.getElementById('selectedPackage').value = packageName;
    document.getElementById('amount').value = amount;
    
    // Show order form
    document.getElementById('orderForm').style.display = 'block';
    
    // Scroll to form
    document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
    
    // Update package card selection
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.package-card').classList.add('selected');
}

// Place order
function placeOrder() {
    if (!currentUser || !selectedPackage) {
        showAlert('Please select a package first', 'error');
        return;
    }

    const uid = document.getElementById('uid').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const note = document.getElementById('note').value;

    if (!uid || !paymentMethod) {
        showAlert('Please fill all required fields', 'error');
        return;
    }

    // Check if payment method is wallet and if user has enough balance
    if (paymentMethod === 'wallet') {
        db.collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                const balance = doc.data().walletBalance || 0;
                if (balance < selectedAmount) {
                    showAlert('Insufficient wallet balance', 'error');
                    return;
                }
                // Deduct from wallet and place order
                deductFromWalletAndPlaceOrder(uid, paymentMethod, note);
            });
    } else {
        // Place order directly for other payment methods
        placeOrderDirectly(uid, paymentMethod, note);
    }
}

// Deduct from wallet and place order
function deductFromWalletAndPlaceOrder(uid, paymentMethod, note) {
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            const currentBalance = doc.data().walletBalance || 0;
            const newBalance = currentBalance - selectedAmount;
            
            return db.collection('users').doc(currentUser.uid).update({
                walletBalance: newBalance
            });
        })
        .then(() => {
            return placeOrderDirectly(uid, paymentMethod, note);
        })
        .catch((error) => {
            console.error('Error deducting from wallet:', error);
            showAlert('Failed to process payment', 'error');
        });
}

// Place order directly
function placeOrderDirectly(uid, paymentMethod, note) {
    const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        game: currentGame,
        package: selectedPackage,
        uid: uid,
        amount: selectedAmount,
        paymentMethod: paymentMethod,
        note: note,
        status: 'pending',
        createdAt: new Date()
    };

    db.collection('orders').add(orderData)
        .then(() => {
            showAlert('Order placed successfully!', 'success');
            // Reset form
            document.getElementById('topupForm').reset();
            document.getElementById('orderForm').style.display = 'none';
            selectedPackage = null;
            selectedAmount = 0;
            
            // Remove package selection
            const packageCards = document.querySelectorAll('.package-card');
            packageCards.forEach(card => {
                card.classList.remove('selected');
            });
        })
        .catch((error) => {
            console.error('Error placing order:', error);
            showAlert('Failed to place order', 'error');
        });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

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
    
    // Insert alert at the top of the dashboard
    const dashboard = document.querySelector('.dashboard');
    dashboard.insertBefore(alert, dashboard.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
} 