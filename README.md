# 🎮 GameTopup - Gaming Top-up Website

A fully functional gaming top-up website built with plain HTML, CSS, and JavaScript using Firebase for authentication and database management.

## 🌟 Features

### 🔐 Authentication System
- **User Login**: Regular users can login with email/password or Google
- 
- **Google Authentication**: OAuth integration for seamless login
- **Role-based Access**: Automatic redirection based on user role

### 🎮 Game Top-up System
- **Multiple Games**: Free Fire, PUBG Mobile, Mobile Legends, Minecraft, Valorant, Roblox
- **Real Packages**: Authentic in-game currency packages with real prices
- **Order Management**: Complete order placement and tracking system
- **Payment Integration**: Multiple payment methods including wallet system

### 👤 User Dashboard
- **Profile Management**: View and manage user information
- **Wallet System**: Add money to wallet with transaction tracking
- **Order History**: Real-time order status tracking (pending, completed, cancelled)
- **Game Navigation**: Easy access to all supported games

### 🛠️ Admin Dashboard
- **Order Management**: View and update all orders
- **Add Money Requests**: Approve/reject wallet top-up requests
- **Real-time Statistics**: Today's sales, total users, order counts
- **Profile Management**: Update admin profile and password

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Firebase project with Authentication and Firestore enabled
- Google account for admin access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gaming-topup-website
   ```

2. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Update Firebase config in `js/firebase-config.js`

4. **Deploy**
   - Upload files to web server
   - Or use GitHub Pages for hosting

## 📁 Project Structure

```
gaming-topup-website/
├── index.html              # User login page
├── admin-login.html        # Admin login page
├── main.html              # User dashboard
├── admin.html             # Admin dashboard
├── styles.css             # Main stylesheet
├── freefire.html          # Free Fire top-up page
├── pubg.html              # PUBG Mobile top-up page
├── mobilelegends.html     # Mobile Legends top-up page
├── minecraft.html         # Minecraft top-up page
├── valorant.html          # Valorant top-up page
├── roblox.html            # Roblox top-up page
├── js/
│   ├── firebase-config.js # Firebase configuration
│   ├── auth.js            # User authentication
│   ├── admin-auth.js      # Admin authentication
│   ├── main.js            # User dashboard functionality
│   ├── admin-dashboard.js # Admin dashboard functionality
│   └── game-topup.js      # Game top-up functionality
└── README.md              # Project documentation
```

## 🎮 Supported Games & Packages

### Free Fire
- 100 Diamonds - ৳80
- 310 Diamonds - ৳240
- 520 Diamonds - ৳400
- 1060 Diamonds - ৳800
- 2180 Diamonds - ৳1600
- 5600 Diamonds - ৳4000

### PUBG Mobile
- 60 UC - ৳100
- 325 UC - ৳500
- 660 UC - ৳1000
- 1325 UC - ৳2000
- 2675 UC - ৳4000
- 6600 UC - ৳10000

### Mobile Legends
- 100 Diamonds - ৳50
- 310 Diamonds - ৳150
- 520 Diamonds - ৳250
- 1060 Diamonds - ৳500
- 2180 Diamonds - ৳1000
- 5600 Diamonds - ৳2500

### Minecraft
- 1000 Coins - ৳200
- 2500 Coins - ৳500
- 5000 Coins - ৳1000
- 10000 Coins - ৳2000
- 25000 Coins - ৳5000
- 50000 Coins - ৳10000

### Valorant
- 1000 VP - ৳150
- 2050 VP - ৳300
- 3675 VP - ৳500
- 5350 VP - ৳750
- 11000 VP - ৳1500
- 23500 VP - ৳3000

### Roblox
- 400 Robux - ৳100
- 800 Robux - ৳200
- 1700 Robux - ৳400
- 4500 Robux - ৳1000
- 10000 Robux - ৳2000
- 22000 Robux - ৳4000

## 🔧 Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "",
  authDomain: "gametopupplus.firebaseapp.com",
  projectId: "gametopupplus",
  storageBucket: "gametopupplus.firebaseapp.com",
  messagingSenderId: "829981614038",
  appId: "1:829981614038:web"
};
```

## 📊 Database Collections

### Users
- `users/{userId}`: User profile and wallet balance

### Orders
- `orders/{orderId}`: Game top-up orders with status tracking

### Add Money Requests
- `addMoneyRequests/{requestId}`: Wallet top-up requests

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional gaming interface
- **Real-time Updates**: Live order status and statistics
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Proper form labels and keyboard navigation

## 🔒 Security Features

- **Authentication**: Firebase Auth with email/password and Google
- **Role-based Access**: Admin-only dashboard access
- **Data Validation**: Client and server-side validation
- **Secure Storage**: Firestore with proper security rules

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch
4. Access via `https://username.github.io/repository-name`

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: tahsan897@gmail.com
- Create an issue in the repository

## 🔄 Updates

- Real-time order status updates
- Live statistics dashboard
- Mobile-responsive design
- Enhanced security features
- Improved user experience

---

**Built with ❤️ using HTML, CSS, JavaScript, and Firebase** 
