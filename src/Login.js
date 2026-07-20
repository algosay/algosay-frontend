import React, { useState } from 'react';
import { signInWithGoogle } from './firebase';

const Login = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-gray-800 bg-gray-50">
      
      {/* LEFT SIDE: App Innovation & Trust Building */}
      <div className="hidden md:flex flex-col w-1/2 bg-white relative overflow-hidden">
        {/* Abstract Premium Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-white -z-10"></div>
        <div className="absolute -left-32 top-32 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        
        {/* TOP LEFT: Giant App Name & Logo */}
        <div className="absolute top-10 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-2xl">A</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            AlgoSay
          </span>
        </div>

        {/* MAIN CONTENT: Centered Vertically */}
        <div className="flex flex-col justify-center h-full px-12 lg:px-20 mt-16">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">
            The Next Evolution in Quant Trading
          </h3>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-6">
            Code-Free Custom Strategies, Powered by AI.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
            Unlike traditional platforms where you manually click through dozens of dropdowns, AlgoSay uses an advanced Neural Engine to understand your logic. Just type it, and we test it.
          </p>

          {/* STEP-BY-STEP INNOVATION EXPLANATION */}
          <div className="space-y-6 max-w-md">
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                1
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Describe Naturally</h4>
                <p className="text-sm text-gray-500 mt-1">Explain your logic in plain English or Tanglish (e.g., "Sell ATM CE at 9:20 AM with 25% SL").</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg shadow-inner">
                2
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">AI Auto-Mapping</h4>
                <p className="text-sm text-gray-500 mt-1">Our AI instantly translates your text into precision options legs, strikes, and execution rules.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg shadow-inner">
                3
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Institutional Insights</h4>
                <p className="text-sm text-gray-500 mt-1">Run blazing-fast historical backtests and get AI-driven diagnostics on your drawdown and MFE/MAE.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Action */}
      <div className="w-full md:w-1/2 bg-[#3B82F6] flex items-center justify-center p-6 relative">
        {/* Decorative elements for the blue background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 lg:p-10 z-10 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your AlgoSay account</p>
          </div>

          <div className="space-y-6">
            {/* Standard Email Input (Placeholder for future) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50"
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-600 font-medium">Remember me</span>
              </label>
              <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            <button disabled className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all opacity-50 cursor-not-allowed">
              Login via Email (Coming Soon)
            </button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute border-t border-gray-200 w-full"></div>
              <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">Or Login With</span>
            </div>

            {/* Google Login Button (The Active One) */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition-all shadow-sm ${isLoading ? 'opacity-70 cursor-wait' : 'hover:shadow-md'}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              {isLoading ? 'Signing In...' : 'Sign in with Google'}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account? <span className="text-blue-600 font-bold hover:underline cursor-pointer transition-all">Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;