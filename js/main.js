// Main Dashboard JavaScript
let currentUser = null;

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
            loadOrders();
        } else {
            window.location.href = 'index.html';
        }
    });

    // Add money form
    const addMoneyForm = document.getElementById('addMoneyForm');
    if (addMoneyForm) {
        addMoneyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addMoneyToWallet();
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
                document.getElementById('walletBalance').textContent = `৳${balance}`;
            } else {
                // Create user document if it doesn't exist
                db.collection('users').doc(currentUser.uid).set({
                    email: currentUser.email,
                    displayName: currentUser.displayName || 'User',
                    walletBalance: 0,
                    createdAt: new Date()
                });
            }
        })
        .catch((error) => {
            console.error('Error loading wallet:', error);
        });
}

// Add money to wallet
function addMoneyToWallet() {
    if (!currentUser) return;

    const senderNumber = document.getElementById('senderNumber').value;
    const transactionId = document.getElementById('transactionId').value;
    const amount = parseInt(document.getElementById('amount').value);

    if (!senderNumber || !transactionId || !amount) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    // Create add money request
    db.collection('addMoneyRequests').add({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        senderNumber: senderNumber,
        transactionId: transactionId,
        amount: amount,
        status: 'pending',
        createdAt: new Date()
    })
    .then(() => {
        showAlert('Add money request submitted successfully!', 'success');
        document.getElementById('addMoneyForm').reset();
    })
    .catch((error) => {
        console.error('Error adding money request:', error);
        showAlert('Failed to submit request', 'error');
    });
}

// Load orders
function loadOrders() {
    if (!currentUser) return;

    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '<p>Loading orders...</p>';

    db.collection('orders')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                ordersList.innerHTML = '<p>No orders found</p>';
                return;
            }

            let ordersHTML = '';
            querySnapshot.forEach((doc) => {
                const order = doc.data();
                const orderDate = order.createdAt.toDate().toLocaleDateString();
                
                ordersHTML += `
                    <div class="order-item">
                        <div class="order-header">
                            <span class="order-id">Order #${doc.id.slice(-8)}</span>
                            <span class="order-status ${order.status}">${order.status}</span>
                        </div>
                        <div class="order-details">
                            <p><strong>Game:</strong> ${order.game}</p>
                            <p><strong>Package:</strong> ${order.package}</p>
                            <p><strong>UID:</strong> ${order.uid}</p>
                            <p><strong>Amount:</strong> ৳${order.amount}</p>
                            <p><strong>Date:</strong> ${orderDate}</p>
                            ${order.note ? `<p><strong>Note:</strong> ${order.note}</p>` : ''}
                        </div>
                    </div>
                `;
            });
            
            ordersList.innerHTML = ordersHTML;
        })
        .catch((error) => {
            console.error('Error loading orders:', error);
            ordersList.innerHTML = '<p>Error loading orders</p>';
        });
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
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