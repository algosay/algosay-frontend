import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const Login = ({ onLoginSuccess, switchToSignup }) => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🚨 Function to initialize or fetch user data in Firestore with 10 Free Credits 🚨
  const handleUserInDB = async (user, userName = 'AlgoSay User', userMobile = '') => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

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

  // Email / Mobile + Password Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!emailOrMobile || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let loginEmail = emailOrMobile;

      // If user typed a mobile number instead of email, check Firestore to find corresponding email
      if (!emailOrMobile.includes('@')) {
        // Note: For production, ensure you query by mobile index or collection query if needed.
        // Here we assume standard email login or provide fallback.
        setError('Please enter your registered email address for login.');
        setLoading(false);
        return;
      }

      // 1. Firebase Sign In
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const user = userCredential.user;

      // 2. Ensure user exists in DB
      await handleUserInDB(user);

      // 3. Success Trigger
      onLoginSuccess(user);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to login. ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check & Initialize in DB (Gives 10 credits only if new user)
      await handleUserInDB(user, user.displayName, '');

      onLoginSuccess(user);
    } catch (err) {
      console.error(err);
      setError('Google Login failed. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-800 selection:bg-blue-200 relative pt-8 overflow-hidden bg-[#121212] items-center justify-center">
      
      {/* 🔥 LIVE FOMO TICKER (Always at Top) 🔥 */}
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-900 text-white flex items-center overflow-hidden z-50 shadow-md">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 text-xs font-semibold tracking-wide px-4"
        >
          <span className="flex items-center gap-2"><span className="text-yellow-400">⚡</span> User Rahul just backtested a 0DTE strategy with 72% Win Rate</span>
          <span className="flex items-center gap-2"><span className="text-orange-500">🔥</span> 15,000+ strategies mapped by AI today</span>
          <span className="flex items-center gap-2"><span className="text-blue-400">💎</span> Karthik deployed an Iron Condor with 4.2 Profit Factor</span>
          <span className="flex items-center gap-2"><span className="text-green-400">🚀</span> System survival probability metrics unlocked for pro users</span>
          <span className="flex items-center gap-2"><span className="text-purple-400">✨</span> FEATURE: Zero-Code Natural Language Strategy Builder</span>
          <span className="flex items-center gap-2"><span className="text-cyan-400">🎯</span> Priya executed a Calendar Spread with 85% accuracy</span>
          <span className="flex items-center gap-2"><span className="text-red-400">📊</span> FEATURE: Institutional Grade Profit Factor & Drawdown Heatmaps</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🛡️</span> FEATURE: Automated MFE/MAE Diagnostics for Risk Management</span>
          <span className="flex items-center gap-2"><span className="text-pink-400">📈</span> 1 Lakh+ Backtests run this week across Nifty & BankNifty</span>
          <span className="flex items-center gap-2"><span className="text-yellow-300">💡</span> FEATURE: Granular 0DTE & Day-wise Filters added</span>
        </motion.div>
      </div>

      <div className="w-full max-w-md bg-[#020205] border border-[#1e1e30] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8 mt-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <img src="/image/logo.png" alt="AlgoSay Logo" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Algo<span className="text-blue-500">Say</span>
          </h1>
          <p className="text-xs text-cyan-400 tracking-[0.2em] font-bold mt-1">PRO QUANT EDGE</p>
          <p className="text-gray-400 text-sm mt-3 text-center">
            Welcome back! Log in to access your pro quant tools.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 block">Email Address</label>
            <input 
              type="text" 
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
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
              placeholder="Enter your password"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-b border-[#2a2a35]"></div>
          <span className="px-3 text-xs text-gray-500 uppercase tracking-widest">OR</span>
          <div className="flex-1 border-b border-[#2a2a35]"></div>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white hover:bg-gray-200 text-black font-bold text-sm transition-all"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Switch to Signup View */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={switchToSignup}
              className="text-blue-400 font-bold hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;