// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyAGXRxKdt8TTsBVzOJ5J0MeI6GlWW58FAw",
  authDomain: "algosay-2026.firebaseapp.com",
  projectId: "algosay-2026",
  storageBucket: "algosay-2026.appfirebasestorage.app",
  messagingSenderId: "645522510011",
  appId: "1:645522510011:web:65dfbef887d4a520c8599e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return user;
  } catch (error) {
    // 🚨 UPDATE: Enhanced Error Logging 🚨
    console.error("Error signing in with Google:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    throw error;
  }
};