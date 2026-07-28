// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail // 🚨 NEW: Import for Forgot Password
} from "firebase/auth";
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

// Initialize Firestore Database
export const db = getFirestore(app);

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    await createUserProfile(user, user.displayName || "Google User", "");
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error.code, error.message);
    throw error;
  }
};

// Email/Password Sign Up Function with Name and Mobile
export const registerNewUser = async (email, password, name, mobile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await createUserProfile(user, name, mobile);
    
    return user;
  } catch (error) {
    console.error("Sign Up Error:", error.code, error.message);
    throw error;
  }
};

// Email/Password Login Function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Login Error:", error.code, error.message);
    throw error;
  }
};

// 🚨 NEW: Forgot Password Function 🚨
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Password Reset Error:", error.code, error.message);
    throw error;
  }
};

// Create User Profile in Database with 10 Free Credits, Name, and Mobile
export const createUserProfile = async (user, name = "", mobile = "") => {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        name: name,
        mobile: mobile,
        email: user.email,
        credits: 10,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log("New user profile created with Name, Mobile and 10 free credits!");
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  } else {
    try {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error updating login time:", error);
    }
  }
};

// Get Real-time User Credits
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

// Deduct 1 Credit when Backtest Runs
export const deductUserCredit = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      credits: increment(-1)
    });
    return true;
  } catch (error) {
    console.error("Error deducting credit:", error);
    return false;
  }
};

// Save User Strategy to Firestore
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

// Get All Saved Strategies for User
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

// Delete Saved Strategy for User
export const deleteUserStrategy = async (strategyId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const strategyRef = doc(db, "users", user.uid, "saved_strategies", strategyId);
    await deleteDoc(strategyRef);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting strategy:", error);
    return { success: false, error: error.message };
  }
};

// Get Common Default Strategies for all users
export const getDefaultStrategies = async () => {
  try {
    const defaultRef = collection(db, "default_strategies");
    const snapshot = await getDocs(defaultRef);
    const defaults = [];
    snapshot.forEach((doc) => {
      defaults.push({ id: doc.id, ...doc.data() });
    });
    return defaults;
  } catch (error) {
    console.error("Error fetching default strategies:", error);
    return [];
  }
};