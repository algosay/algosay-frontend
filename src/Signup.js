import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, checkEmailExists } from './firebase'; // 🚨 UPDATED: Imported checkEmailExists from firebase.js

const Signup = ({ onSignupSuccess, switchToLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // Update: Added success message state

  // 🚨 Function to initialize user data in Firestore with 10 FREE CREDITS 🚨
  const initializeUserInDB = async (user, userName, userMobile) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // If user doesn't exist in DB, create new record with 10 credits
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: userName || user.displayName || 'AlgoSay User',
        mobile: userMobile || '',
        email: user.email,
        credits: 10, // 🎁 10 FREE BACKTEST CREDITS FOR NEW USER
        subscription: {
          is_active: false,
          plan_type: 'free',
          end_date: null
        },
        createdAt: serverTimestamp()
      });
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !mobile || !email || !password) {
      setError('Please fill all the fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // 🚨 LATEST UPDATE: Check if the entered email already exists in Firebase before signing up
      const emailExists = await checkEmailExists(email);

      if (emailExists) {
        // If the email is already registered, redirect them to Login view automatically
        setError('Email already exists. Redirecting to Login...');
        setTimeout(() => {
          switchToLogin();
        }, 1500);
        setLoading(false);
        return;
      }

      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save additional details (Name, Mobile, 10 Credits) in Firestore
      await initializeUserInDB(user, name, mobile);

      // 3. Trigger success message & Redirect to Login
      setSuccessMsg('Account created successfully! 🎁 10 Free Credits added. Redirecting to Login...');
      setTimeout(() => {
        switchToLogin(); // Automatically switches to Login view after 2 seconds
      }, 2000);

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists. Redirecting to Login...');
        setTimeout(() => {
          switchToLogin();
        }, 1500);
      } else {
        setError('Failed to create an account. ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check & Initialize in DB (Gives 10 credits only if they are entirely new)
      await initializeUserInDB(user, user.displayName, '');

      // Google signup directly logs them in, so we pass it to main app
      onSignupSuccess(user);
    } catch (err) {
      console.error(err);
      setError('Google Signup failed. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md bg-[#020205] border border-[#1e1e30] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <img src="/image/logo.png" alt="AlgoSay Logo" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Algo<span className="text-blue-500">Say</span>
          </h1>
          <p className="text-xs text-cyan-400 tracking-[0.2em] font-bold mt-1">PRO QUANT EDGE</p>
          <p className="text-gray-400 text-sm mt-3 text-center">
            Create an account and get <span className="text-yellow-500 font-bold">10 Free Credits</span> instantly!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Update: Success Message UI added */}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-6 text-center font-semibold">
            {successMsg}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
          
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#121212] border border-[#2a2a35] text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Mobile Number</label>
            <input 
              type="tel" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-[#121212] border border-[#2a2a35] text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Email (Gmail)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#121212] border border-[#2a2a35] text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-[#121212] border border-[#2a2a35] text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-3.5 rounded-lg font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
              loading 
              ? 'bg-blue-600/50 text-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-b border-[#2a2a35]"></div>
          <span className="px-3 text-xs text-gray-500 uppercase tracking-widest">OR</span>
          <div className="flex-1 border-b border-[#2a2a35]"></div>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white hover:bg-gray-200 text-black font-bold text-sm transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        {/* Switch to Login View */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button 
              onClick={switchToLogin}
              className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Login here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;