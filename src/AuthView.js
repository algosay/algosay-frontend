import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🚨 UPDATE: Puthiya Firebase functions import pannirukkom
import { signInWithGoogle, registerNewUser, loginUser, resetPassword } from './firebase';
import AlgoSayLogo from './AlgoSayLogo';
import { AlertTriangle, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Star, ArrowLeft, Eye, EyeOff, CheckCircle, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: "Vikramaditya S.",
    role: "Quantitative Options Trader",
    location: "Mumbai",
    rating: 5,
    tag: "0DTE & BankNifty Specialist",
    text: "I've tried almost every backtesting platform in India, but nothing comes close to AlgoSay. Being able to type complex multi-leg 0DTE logic in natural language and get precision option leg results in seconds feels like magic. Hats off team!",
    verified: true
  },
  {
    name: "Kavitha Raman",
    role: "Systematic Portfolio Manager",
    location: "Chennai",
    rating: 5,
    tag: "Custom Indicator Strategies",
    text: "Earlier I had to hire freelancers or write complex Python code just to backtest customized RSI+VIX strategies with trailing SL. AlgoSay handled my most difficult strategy seamlessly on the first attempt. Genuine game changer!",
    verified: true
  },
  {
    name: "Anirudh Mehta",
    role: "Full-time F&O Trader",
    location: "Bengaluru",
    rating: 5,
    tag: "Iron Condor & Straddle Trader",
    text: "The institutional MFE/MAE diagnostics and System Survival metrics completely transformed my risk management. Never seen such deep analysis in any retail backtest app before. Pure innovation!",
    verified: true
  },
  {
    name: "Rajesh Nair",
    role: "Algorithmic Trader",
    location: "Hyderabad",
    rating: 5,
    tag: "Positional Option Buyer",
    text: "From natural language prompt input to granular day-wise drawdown heatmaps in 5 seconds... this platform is unreal. Joining the profitable top 1% is finally realistic without writing a single line of code.",
    verified: true
  }
];

const AuthView = ({ onBack, isSignUp, setIsSignUp, onLoginSuccess, custom, viewVariants }) => {
  const [activeReview, setActiveReview] = useState(0);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState(null);
  
  // 🚨 UPDATE: Forgot Password flow-kaga puthiya states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // Auto-rotate reviews every 5 seconds
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
      setAuthError("Google Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  // 🚨 UPDATE: Unmaiyana Firebase Sign Up & Login connect panniyachu
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setResetMessage('');
    
    if (isSignUp && (!fullName || !mobileNumber)) {
      setAuthError('Please fill in all the details.');
      return;
    }
    
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isSignUp) {
        // Calling puthu registerNewUser function
        result = await registerNewUser(email, password, fullName, mobileNumber);
      } else {
        // Calling puthu loginUser function
        result = await loginUser(email, password);
      }

      // Result user object aah illana userCredential aah nu check panni pass panrom
      const loggedInUser = result.user ? result.user : result;
      if (loggedInUser) {
        onLoginSuccess(loggedInUser);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Email already exists. Please log in instead.');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setAuthError('Invalid email or password. Please try again.');
      } else {
        setAuthError('Authentication failed. ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🚨 UPDATE: Forgot Password Handle panrathukana function
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setResetMessage('');
    
    if (!email) {
      setAuthError('Please enter your email address to reset password.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetMessage('Password reset link sent! Please check your inbox.');
    } catch (error) {
      console.error("Reset Error:", error);
      if (error.code === 'auth/user-not-found') {
        setAuthError('No account found with this email.');
      } else {
        setAuthError('Failed to send reset email. ' + error.message);
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
      className="w-full min-h-screen lg:h-screen flex flex-col lg:flex-row relative z-10 pt-0 bg-[#0b0e14]"
    >
      {/* Back Button - Fixed Z-index and position */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 lg:left-10 flex items-center gap-2 text-white/80 hover:text-white font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/10 transition-all z-[60] hover:-translate-x-1"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      {/* LEFT SIDE: Reviews & Reality Check with Candlestick Theme */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-full bg-[#0a0f1c] flex flex-col justify-center items-center p-6 pt-24 pb-20 lg:p-12 relative overflow-hidden z-10 border-r border-white/5 order-2 lg:order-1">
        
        {/* Background Candlestick Graph Elements */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Abstract Candles inspired by image */}
          <div className="absolute right-[15%] bottom-[20%] flex items-end gap-3 opacity-80 blur-[1px]">
             {/* Candle 1 (Green) */}
             <div className="relative w-4 h-24 bg-emerald-500 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]">
               <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-[2px] h-32 bg-emerald-500"></div>
             </div>
             {/* Candle 2 (Red) */}
             <div className="relative w-4 h-16 bg-rose-500 rounded-sm shadow-[0_0_15px_rgba(244,63,94,0.5)] mb-8">
               <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[2px] h-24 bg-rose-500"></div>
             </div>
             {/* Candle 3 (Green - Tall) */}
             <div className="relative w-4 h-36 bg-emerald-500 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-4">
               <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 w-[2px] h-48 bg-emerald-500"></div>
               <div className="absolute top-[-40px] right-[-60px] bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] px-2 py-1 rounded font-bold">▲ 5.83%</div>
             </div>
             {/* Candle 4 (Red) */}
             <div className="relative w-4 h-20 bg-rose-500 rounded-sm shadow-[0_0_15px_rgba(244,63,94,0.5)] mb-12">
               <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[2px] h-32 bg-rose-500"></div>
               <div className="absolute top-[-10px] left-[-70px] bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[10px] px-2 py-1 rounded font-bold">▼ -7.38%</div>
             </div>
          </div>
          
          {/* Glow effects */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md space-y-6 mt-8 lg:mt-0 relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> Premium Trading
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
              Join the top <span className="text-rose-500">1%</span> Traders.
            </h2>
            <p className="text-sm font-medium text-slate-400">Don't rely on gut feelings. Backtest every strategy with Algosay's precision.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="w-full bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-rose-500/20 shadow-2xl p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 opacity-80"></div>
            <div className="flex items-start gap-3.5 relative z-10">
               <div className="p-2.5 bg-rose-950/50 rounded-xl border border-rose-500/30 shrink-0 shadow-sm mt-0.5">
                 <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
               </div>
               <div className="flex-grow">
                 <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] font-black tracking-wider uppercase text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/20">SEBI Market Reality</span>
                   <span className="text-[10px] font-extrabold text-slate-500">Official Study</span>
                 </div>
                 <h4 className="text-white font-black text-base mb-1 leading-snug">93% of Retail F&O Traders Suffer Losses</h4>
                 <p className="text-slate-400 text-xs leading-relaxed font-medium mb-1">
                   SEBI's latest report reveals individual traders lost over <span className="text-rose-400 font-black">₹1.81 Lakh Crore</span> in F&O due to unverified gut feelings without systematic testing.
                 </p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-blue-500/20 shadow-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-950/50 text-blue-400 rounded-lg border border-blue-500/30">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider">Trader Reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setActiveReview((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveReview((prev) => (prev + 1) % testimonials.length)} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/10">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeReview} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.35, ease: "easeOut" }} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                          {testimonials[activeReview].name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h5 className="text-white font-extrabold text-xs sm:text-sm">{testimonials[activeReview].name}</h5>
                            {testimonials[activeReview].verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-900/50" />}
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">{testimonials[activeReview].role} • {testimonials[activeReview].location}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(testimonials[activeReview].rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0b0e14]/80 rounded-xl p-3 border border-white/5 relative">
                      <p className="text-xs text-slate-300 leading-relaxed font-medium italic">"{testimonials[activeReview].text}"</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Light Blue Theme (Login Form) - Fixed overflow and cutoff */}
      <div className="w-full lg:w-1/2 lg:h-full bg-gradient-to-br from-slate-100 via-blue-50/80 to-indigo-100/70 overflow-y-auto flex flex-col items-center justify-start lg:justify-center p-6 py-24 lg:p-12 relative z-0 order-1 lg:order-2">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Removed my-auto and added proper margins so it doesn't cut at the top */}
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.12)] p-8 lg:p-10 z-10 border border-white shrink-0 mt-12 lg:mt-0 mb-8 lg:mb-0">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-3 mb-2">
              <AlgoSayLogo className="w-12 h-12 shadow-lg shadow-blue-500/30 rounded-2xl" />
              <span className="text-4xl font-extrabold tracking-tight pb-1">
                <span className="text-black">Algo</span>
                <span className="text-blue-600">Say</span>
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500 mt-2">
              {isForgotPassword 
                ? 'Reset your password' 
                : isSignUp 
                  ? 'Create your AlgoSay account' 
                  : 'Sign in to your AlgoSay terminal'}
            </p>
          </div>

          <form onSubmit={isForgotPassword ? handleResetPassword : handleEmailAuth} className="space-y-4 w-full">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">
                {isForgotPassword ? 'Recovery' : `Secure ${isSignUp ? 'Registration' : 'Login'}`}
              </span>
            </div>

            {authError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-4 flex items-center gap-2 w-full box-border">
                <AlertTriangle size={18} className="shrink-0" /> {authError}
              </motion.div>
            )}

            {resetMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-bold mb-4 flex items-center gap-2 w-full box-border">
                <CheckCircle size={18} className="shrink-0" /> {resetMessage}
              </motion.div>
            )}

            {/* Sign Up Fields - Hidden during Forgot Password or Login */}
            {isSignUp && !isForgotPassword && (
              <>
                <div className="w-full box-border">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium box-border" required />
                </div>
                <div className="w-full box-border">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
                  <input type="tel" placeholder="+91 9876543210" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium box-border" required />
                </div>
              </>
            )}

            <div className="w-full box-border">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium box-border" required />
            </div>
            
            {/* Password Field - Hidden during Forgot Password */}
            {!isForgotPassword && (
              <div className="w-full box-border">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative w-full box-border">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm bg-slate-50 text-slate-900 placeholder-slate-400 font-medium box-border pr-12" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password Toggles */}
            {!isForgotPassword && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-600" />
                  <span className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                {!isSignUp && (
                  <span onClick={() => { setIsForgotPassword(true); setAuthError(''); setResetMessage(''); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                    Forgot Password?
                  </span>
                )}
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 text-sm mt-2 box-border flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                isForgotPassword ? 'Send Reset Link' : (isSignUp ? 'Sign Up' : 'Log In')
              )}
            </button>

            {/* Back to Login logic for Forgot Password screen */}
            {isForgotPassword && (
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-slate-600">
                  Remember your password?{" "}
                  <span onClick={() => { setIsForgotPassword(false); setAuthError(''); setResetMessage(''); }} className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                    Back to Login
                  </span>
                </p>
              </div>
            )}

            {/* Social Login - Hidden during Forgot Password */}
            {!isForgotPassword && (
              <>
                <div className="relative flex items-center justify-center mt-5 mb-5">
                  <div className="absolute border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest relative z-10 rounded-full">Or Continue With</span>
                </div>

                <div className="relative p-[2px] rounded-xl group overflow-hidden bg-slate-200 w-full box-border">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button type="button" onMouseDown={handleRippleClick} disabled={isLoading} className={`relative w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-[10px] transition-colors shadow-sm overflow-hidden z-10 text-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}>
                    <AnimatePresence>
                      {ripple && (
                        <motion.span key={ripple.id} initial={{ scale: 0, opacity: 0.4 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute bg-blue-300 rounded-full pointer-events-none" style={{ left: ripple.x, top: ripple.y, width: 100, height: 100, transform: 'translate(-50%, -50%)' }} />
                      )}
                    </AnimatePresence>

                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-blue-600 relative z-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5 relative z-20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    )}
                    <span className="relative z-20">{isLoading ? 'Signing In...' : 'Sign in with Google'}</span>
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                      {isSignUp ? "Log In" : "Sign Up"}
                    </span>
                  </p>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthView;