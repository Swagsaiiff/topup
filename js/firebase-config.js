// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTSDXAnJP4iW1xTwq58ebQ02d6NubZ908",
  authDomain: "gametopupplus.firebaseapp.com",
  projectId: "gametopupplus",
  storageBucket: "gametopupplus.firebaseapp.com",
  messagingSenderId: "829981614038",
  appId: "1:829981614038:web"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider(); 