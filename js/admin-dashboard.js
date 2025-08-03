// Admin Dashboard JavaScript
let currentAdmin = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Check if user is admin
            if (user.email === 'tahsan897@gmail.com') {
                currentAdmin = user;
                loadAdminData();
                loadStatistics();
                loadAllOrders();
                loadAddMoneyRequests();
            } else {
                // Redirect non-admin users
                auth.signOut().then(() => {
                    window.location.href = 'index.html';
                });
            }
        } else {
            window.location.href = 'admin-login.html';
        }
    });

    // Admin profile form
    const adminProfileForm = document.getElementById('adminProfileForm');
    if (adminProfileForm) {
        adminProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateAdminProfile();
        });
    }
});

// Load admin data
function loadAdminData() {
    const adminName = document.getElementById('adminName');
    const adminEmail = document.getElementById('adminEmail');
    const adminPhoto = document.getElementById('adminPhoto');
    const adminDisplayName = document.getElementById('adminDisplayName');
    const adminEmailInput = document.getElementById('adminEmailInput');

    if (currentAdmin) {
        adminName.textContent = currentAdmin.displayName || 'Admin';
        adminEmail.textContent = currentAdmin.email;
        adminDisplayName.value = currentAdmin.displayName || '';
        adminEmailInput.value = currentAdmin.email;
        
        if (currentAdmin.photoURL) {
            adminPhoto.src = currentAdmin.photoURL;
        }
    }
}

// Load statistics
function loadStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's sales
    db.collection('orders')
        .where('status', '==', 'completed')
        .where('createdAt', '>=', today)
        .get()
        .then((querySnapshot) => {
            let totalSales = 0;
            querySnapshot.forEach((doc) => {
                totalSales += doc.data().amount || 0;
            });
            document.getElementById('todaySales').textContent = `৳${totalSales}`;
        });

    // Total users
    db.collection('users').get()
        .then((querySnapshot) => {
            document.getElementById('totalUsers').textContent = querySnapshot.size;
        });

    // Pending orders
    db.collection('orders')
        .where('status', '==', 'pending')
        .get()
        .then((querySnapshot) => {
            document.getElementById('pendingOrders').textContent = querySnapshot.size;
        });

    // Completed orders
    db.collection('orders')
        .where('status', '==', 'completed')
        .get()
        .then((querySnapshot) => {
            document.getElementById('completedOrders').textContent = querySnapshot.size;
        });
}

// Load all orders
function loadAllOrders() {
    const ordersList = document.getElementById('allOrdersList');
    ordersList.innerHTML = '<p>Loading orders...</p>';

    db.collection('orders')
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
                            <p><strong>User:</strong> ${order.userEmail}</p>
                            <p><strong>Game:</strong> ${order.game}</p>
                            <p><strong>Package:</strong> ${order.package}</p>
                            <p><strong>UID:</strong> ${order.uid}</p>
                            <p><strong>Amount:</strong> ৳${order.amount}</p>
                            <p><strong>Date:</strong> ${orderDate}</p>
                            ${order.note ? `<p><strong>Note:</strong> ${order.note}</p>` : ''}
                        </div>
                        <div class="order-actions">
                            ${order.status === 'pending' ? `
                                <button onclick="updateOrderStatus('${doc.id}', 'completed')" class="btn-primary">Complete</button>
                                <button onclick="updateOrderStatus('${doc.id}', 'cancelled')" class="btn-primary" style="background: #ff4757;">Cancel</button>
                            ` : ''}
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

// Update order status
function updateOrderStatus(orderId, status) {
    db.collection('orders').doc(orderId).update({
        status: status,
        updatedAt: new Date()
    })
    .then(() => {
        showAlert(`Order ${status} successfully!`, 'success');
        loadAllOrders();
        loadStatistics();
    })
    .catch((error) => {
        console.error('Error updating order:', error);
        showAlert('Failed to update order', 'error');
    });
}

// Load add money requests
function loadAddMoneyRequests() {
    const requestsList = document.getElementById('addMoneyRequestsList');
    requestsList.innerHTML = '<p>Loading requests...</p>';

    db.collection('addMoneyRequests')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                requestsList.innerHTML = '<p>No requests found</p>';
                return;
            }

            let requestsHTML = '';
            querySnapshot.forEach((doc) => {
                const request = doc.data();
                const requestDate = request.createdAt.toDate().toLocaleDateString();
                
                requestsHTML += `
                    <div class="order-item">
                        <div class="order-header">
                            <span class="order-id">Request #${doc.id.slice(-8)}</span>
                            <span class="order-status ${request.status}">${request.status}</span>
                        </div>
                        <div class="order-details">
                            <p><strong>User:</strong> ${request.userEmail}</p>
                            <p><strong>Sender Number:</strong> ${request.senderNumber}</p>
                            <p><strong>Transaction ID:</strong> ${request.transactionId}</p>
                            <p><strong>Amount:</strong> ৳${request.amount}</p>
                            <p><strong>Date:</strong> ${requestDate}</p>
                        </div>
                        <div class="order-actions">
                            ${request.status === 'pending' ? `
                                <button onclick="updateAddMoneyRequest('${doc.id}', 'completed', ${request.amount}, '${request.userId}')" class="btn-primary">Approve</button>
                                <button onclick="updateAddMoneyRequest('${doc.id}', 'rejected', 0, '${request.userId}')" class="btn-primary" style="background: #ff4757;">Reject</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            requestsList.innerHTML = requestsHTML;
        })
        .catch((error) => {
            console.error('Error loading requests:', error);
            requestsList.innerHTML = '<p>Error loading requests</p>';
        });
}

// Update add money request status
function updateAddMoneyRequest(requestId, status, amount, userId) {
    // Update request status
    db.collection('addMoneyRequests').doc(requestId).update({
        status: status,
        updatedAt: new Date()
    })
    .then(() => {
        if (status === 'completed') {
            // Add money to user's wallet
            return db.collection('users').doc(userId).get();
        }
        return null;
    })
    .then((userDoc) => {
        if (userDoc && status === 'completed') {
            const currentBalance = userDoc.data().walletBalance || 0;
            return db.collection('users').doc(userId).update({
                walletBalance: currentBalance + amount
            });
        }
        return null;
    })
    .then(() => {
        showAlert(`Request ${status} successfully!`, 'success');
        loadAddMoneyRequests();
    })
    .catch((error) => {
        console.error('Error updating request:', error);
        showAlert('Failed to update request', 'error');
    });
}

// Update admin profile
function updateAdminProfile() {
    const displayName = document.getElementById('adminDisplayName').value;
    const email = document.getElementById('adminEmailInput').value;
    const newPassword = document.getElementById('adminNewPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;

    if (newPassword && newPassword !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    // Update display name
    currentAdmin.updateProfile({
        displayName: displayName
    })
    .then(() => {
        if (newPassword) {
            return currentAdmin.updatePassword(newPassword);
        }
        return null;
    })
    .then(() => {
        showAlert('Profile updated successfully!', 'success');
        loadAdminData();
    })
    .catch((error) => {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile: ' + error.message, 'error');
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
        window.location.href = 'admin-login.html';
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