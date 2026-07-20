// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
// 🚨 NEW: Import Firestore Database functions (Added collection, addDoc, getDocs, deleteDoc)
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc, increment, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGXRxKdt8TTsBvZOJ5JOMeI6GlWW58FAw",
  authDomain: "algosay-2026.firebaseapp.com",
  projectId: "algosay-2026",
  storageBucket: "algosay-2026.firebasestorage.app",
  messagingSenderId: "645522510011",
  appId: "1:645522510011:web:65dfbef887d4a520c8599e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🚨 NEW: Initialize Firestore Database
export const db = getFirestore(app);

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error.code, error.message);
    throw error;
  }
};

// 🚨 NEW: Email/Password Sign Up Function
export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign Up Error:", error.code, error.message);
    throw error;
  }
};

// 🚨 NEW: Email/Password Login Function
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.code, error.message);
    throw error;
  }
};

// 🚨 NEW: Create User Profile in Database with 10 Free Credits
export const createUserProfile = async (user) => {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // If user doesn't exist in database, create them with 10 credits!
  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        credits: 10, // Welcome Bonus
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log("New user profile created with 10 free credits!");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  } else {
    // If user already exists, just update their last login time
    try {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error updating login time:", error);
    }
  }
};

// 🚨 NEW: Get Real-time User Credits
export const getUserCredits = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().credits;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
};

// 🚨 NEW: Deduct 1 Credit when Backtest Runs
export const deductUserCredit = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    // increment(-1) will safely subtract exactly 1 credit in the database
    await updateDoc(userRef, {
      credits: increment(-1)
    });
    return true;
  } catch (error) {
    console.error("Error deducting credit:", error);
    return false;
  }
};

// 🚨 NEW: Save User Strategy to Firestore
export const saveUserStrategy = async (uid, strategyName, strategyData) => {
  try {
    const strategiesRef = collection(db, "users", uid, "saved_strategies");
    const docRef = await addDoc(strategiesRef, {
      name: strategyName,
      data: strategyData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving strategy:", error);
    return { success: false, error: error.message };
  }
};

// 🚨 NEW: Get All Saved Strategies for User
export const getUserStrategies = async (uid) => {
  try {
    const strategiesRef = collection(db, "users", uid, "saved_strategies");
    const snapshot = await getDocs(strategiesRef);
    const strategies = [];
    snapshot.forEach((doc) => {
      strategies.push({ id: doc.id, ...doc.data() });
    });
    return strategies;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }
};

// 🚨 NEW: Delete Saved Strategy for User
export const deleteUserStrategy = async (strategyId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // Correct path: "users" -> "uid" -> "saved_strategies" -> "strategyId"
    const strategyRef = doc(db, "users", user.uid, "saved_strategies", strategyId);
    await deleteDoc(strategyRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting strategy:", error);
    return { success: false, error: error.message };
  }
};