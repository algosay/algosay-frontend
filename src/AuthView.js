import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🚨 UPDATE: Removed missing registerUser & loginUser, imported auth and db
import { auth, db, signInWithGoogle } from './firebase'; 
// 🚨 UPDATE: Imported standard Firebase Authentication & Firestore functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import AlgoSayLogo from './AlgoSayLogo';
import { AlertTriangle, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Star, ArrowLeft, User, Phone, Mail, Lock } from 'lucide-react';

const testimonials = [
  {
    name: "Vikramaditya S.",
    role: "Quantitative Options Trader",
    location: "Mumbai",
    rating: 5,
    tag: "0DTE & BankNifty Specialist",
    text: "I've tried almost every backtesting platform in India, but nothing comes close to AlgoSay. Typing complex multi-leg logic in natural language and getting results in seconds feels like magic.",
    verified: true
  },
  {
    name: "Kavitha Raman",
    role: "Systematic Portfolio Manager",
    location: "Chennai",
    rating: 5,
    tag: "Custom Indicator Strategies",
    text: "Earlier I had to hire freelancers to backtest custom RSI+VIX strategies. AlgoSay handled my most difficult strategy seamlessly on the first attempt!",
    verified: true
  }
];

const AuthView = ({ onBack, isSignUp = true, setIsSignUp, onLoginSuccess, custom, viewVariants }) => {
  const [activeReview, setActiveReview] = useState(0);
  
  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Used for signup
  const [identifier, setIdentifier] = useState(''); // Used for login (Email or Mobile)
  const [password, setPassword] = useState('');
  
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error) {
      setAuthError("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Validation
        if (!name || !phone || !email || !password) {
          setAuthError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        // 🚨 UPDATE: Replaced custom registerUser with standard Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 🚨 UPDATE: Directly saving user info & 10 Free credits to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          phone: phone,
          email: email,
          credits: 10,
          createdAt: new Date(),
          subscription: { is_active: false, plan_type: 'Free' }
        });

        if (user) {
          onLoginSuccess(user);
        }
      } else {
        // Login Logic (Email OR Mobile)
        if (!identifier || !password) {
          setAuthError('Please enter your Email/Mobile and Password.');
          setIsLoading(false);
          return;
        }

        // 🚨 UPDATE: Replaced custom loginUser with standard Firebase Auth
        // Note: Standard Firebase uses Email. If you need Mobile login later, you can add OTP logic.
        const userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        if (userCredential.user) {
          onLoginSuccess(userCredential.user);
        }
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Try Logging in.');
      } else {
        setAuthError(error.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRippleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
    handleGoogleLogin();
  };

  return (
    <motion.div 
      custom={custom}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen lg:h-screen flex flex-col lg:flex-row relative z-10 pt-0"
    >
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 lg:left-10 flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-all z-[60] hover:-translate-x-1"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      {/* LEFT SIDE: Reviews & Market Info */}
      <div className="w-full lg:w-1/2 lg:h-full bg-white flex flex-col justify-center items-center p-6 pt-16 pb-20 lg:p-12 relative overflow-y-visible lg:overflow-y-auto z-10 border-r border-slate-100 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-6 mt-8 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Join the top 1% Traders.</h2>
            <p className="text-sm font-medium text-slate-500">Don't rely on gut feelings. Backtest everything with AlgoSay.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="w-full bg-white rounded-2xl border border-rose-100 shadow-xl shadow-rose-900/5 p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"></div>
            <div className="flex items-start gap-3.5 relative z-10">
               <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200/80 shrink-0 shadow-sm mt-0.5">
                 <AlertTriangle className="w-6 h-6 text-rose-600 animate-pulse" />
               </div>
               <div className="flex-grow">
                 <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] font-black tracking-wider uppercase text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">SEBI Market Reality</span>
                   <span className="text-[10px] font-extrabold text-slate-400">Official Study</span>
                 </div>
                 <h4 className="text-slate-900 font-black text-base mb-1 leading-snug">93% of Retail F&O Traders Suffer Losses</h4>
                 <p className="text-slate-600 text-xs leading-relaxed font-medium mb-1">
                   SEBI's latest report reveals individual traders lost over <span className="text-rose-600 font-black">₹1.81 Lakh Crore</span> in F&O due to unverified gut feelings without systematic testing.
                 </p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-900/5 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Trader Reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setActiveReview((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveReview((prev) => (prev + 1) % testimonials.length)} className="p-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeReview} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35, ease: "easeOut" }} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
                          {testimonials[activeReview].name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="text-slate-900 font-extrabold text-xs sm:text-sm">{testimonials[activeReview].name}</h5>
                            {testimonials[activeReview].verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />}
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold">{testimonials[activeReview].role} • {testimonials[activeReview].location}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(testimonials[activeReview].rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 relative">
                      <p className="text-xs text-slate-700 leading-relaxed font-medium italic">"{testimonials[activeReview].text}"</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Dynamic Auth Form */}
      <div className="w-full lg:w-1/2 lg:h-full bg-gradient-to-br from-slate-100 via-blue-50/80 to-indigo-100/70 flex flex-col items-center justify-center p-6 pt-24 pb-12 lg:p-12 relative overflow-y-auto z-0 order-1 lg:order-2">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.12)] p-8 lg:p-10 z-10 border border-white my-auto">
          
          {/* Logo Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-3 mb-1">
              <AlgoSayLogo className="w-12 h-12 min-w-[48px] min-h-[48px] shrink-0 shadow-lg shadow-blue-500/30 rounded-2xl overflow-visible p-0.5" />
              <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">AlgoSay</span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-1 text-center">
              {isSignUp ? 'Create account & Get 10 Free Backtests 🎁' : 'Sign in to access your backtest terminal'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" /> {authError}
              </motion.div>
            )}

            {/* IF SIGN UP: SHOW NAME & PHONE */}
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium" 
                      required 
                    />
                  </div>
                </div>
              </>
            )}

            {/* COMMON FIELDS: EMAIL/MOBILE & PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isSignUp ? 'Email Address' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                {isSignUp ? (
                   <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
                ) : (
                   <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
                )}
                <input 
                  type={isSignUp ? "email" : "text"} 
                  placeholder={isSignUp ? "you@example.com" : "Email or Phone number"} 
                  value={isSignUp ? email : identifier} 
                  onChange={(e) => isSignUp ? setEmail(e.target.value) : setIdentifier(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isSignUp ? 'Setup Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-xs bg-slate-50 text-slate-900 placeholder-slate-400 font-medium" 
                  required 
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600" />
                  <span className="text-xs text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <span className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">Forgot Password?</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all text-xs mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Processing...' : (isSignUp ? 'Claim 10 Free Credits & Sign Up' : 'Sign In')}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or</span>
            </div>

            {/* Google Direct Sign-In Button */}
            <div className="relative p-[2px] rounded-xl group overflow-hidden bg-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button 
                type="button" 
                onMouseDown={handleRippleClick} 
                disabled={isLoading} 
                className={`relative w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 text-xs ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                <AnimatePresence>
                  {ripple && (
                    <motion.span key={ripple.id} initial={{ scale: 0, opacity: 0.4 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute bg-blue-300 rounded-full pointer-events-none" style={{ left: ripple.x, top: ripple.y, width: 100, height: 100, transform: 'translate(-50%, -50%)' }} />
                  )}
                </AnimatePresence>

                <svg className="w-4 h-4 relative z-20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>

                <span className="relative z-20">{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
            </div>
            
            {/* Toggle Sign Up / Login */}
            <div className="mt-4 text-center">
              <p className="text-xs font-semibold text-slate-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <span 
                  onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} 
                  className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer transition-colors underline ml-1"
                >
                  {isSignUp ? "Log In" : "Sign Up for free"}
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthView;