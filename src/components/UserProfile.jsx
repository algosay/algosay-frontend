import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Update path if needed
import { doc, getDoc } from 'firebase/firestore';

const UserProfile = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Calculate remaining days for unlimited plan
  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return 0;
    
    // Firestore timestamp convert pandrom
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const now = new Date();
    
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Format date to show readable format (e.g., Aug 1, 2026)
  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return '';
    const date = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
      </div>
    );
  }

  // Check if active and get days left
  const daysLeft = (userData?.subscription?.is_active && userData?.subscription?.end_date) 
    ? calculateDaysLeft(userData.subscription.end_date) 
    : 0;

  // Get readable expiry date
  const exactExpiryDate = (userData?.subscription?.is_active && userData?.subscription?.end_date) 
    ? formatExpiryDate(userData.subscription.end_date) 
    : null;

  return (
    // 🚨 UPDATED: z-[999] added to ensure it stays strictly above the header 🚨
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      
      {/* 🚨 UPDATED: mt-16 to physically move the modal down below the top nav, plus neon glowing borders 🚨 */}
      <div className="bg-[#05050a] w-full max-w-lg rounded-2xl border border-blue-500/20 shadow-[0_0_40px_rgba(0,100,255,0.15)] overflow-hidden flex flex-col mt-16 md:mt-20">
        
        {/* Header - Neon Title */}
        <div className="p-6 border-b border-[#1e1e30] flex justify-between items-center bg-[#0a0a14]">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <svg className="w-7 h-7 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 tracking-wide">
              My Profile
            </span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          
          {/* Email Info - Dark sleek look */}
          <div className="bg-[#0c0c16] p-4 rounded-xl border border-[#1e1e30] flex items-center gap-4 shadow-inner">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              {auth.currentUser?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs tracking-wider text-cyan-500/80 font-bold uppercase mb-1">Registered Email</p>
              <p className="text-lg text-gray-200 font-bold">{auth.currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pay-As-You-Go Credits Card - Blue Neon Glow */}
            <div className="bg-gradient-to-br from-[#0a1930] to-[#05050a] p-5 rounded-xl border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-400 transition-all">
              <p className="text-xs tracking-widest text-blue-400 font-black uppercase mb-2">Available Credits</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {userData?.credits || 0}
                </span>
                <span className="text-sm text-blue-500/70 font-bold mb-1 uppercase">Tokens</span>
              </div>
            </div>

            {/* Unlimited Plan Card - Yellow/Gold Neon Glow */}
            <div className="bg-gradient-to-br from-[#30200a] to-[#05050a] p-5 rounded-xl border border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:border-yellow-400 transition-all">
              <p className="text-xs tracking-widest text-yellow-500 font-black uppercase mb-2">Unlimited Plan</p>
              {daysLeft > 0 ? (
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{daysLeft}</span>
                    <span className="text-sm text-yellow-500/70 font-bold mb-1 uppercase">Days Left</span>
                  </div>
                  {/* Shows Expiry Date Here */}
                  <p className="text-xs text-green-400 mt-3 font-bold bg-green-900/30 inline-block px-2 py-1 rounded-md border border-green-500/30">
                    ✅ Active until {exactExpiryDate}
                  </p>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-xl font-black text-gray-500">No Active Plan</p>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">Upgrade to get unlimited.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Action - Neon Buttons */}
        <div className="p-6 border-t border-[#1e1e30] bg-[#0a0a14] flex gap-4">
          {/* Back Button */}
          <button 
            onClick={onClose} 
            className="flex-1 py-3 bg-transparent hover:bg-[#1a1a24] text-gray-300 hover:text-white font-bold rounded-xl border border-gray-700 hover:border-gray-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all uppercase tracking-wider text-sm"
          >
            Back
          </button>
          
          {/* Logout Button - Matches Top Nav Red Neon */}
          <button 
            onClick={() => {
              auth.signOut();
              window.location.reload();
            }} 
            className="flex-1 py-3 bg-transparent hover:bg-[#e11d48]/10 text-[#f43f5e] font-bold rounded-xl border border-[#e11d48] hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all uppercase tracking-wider text-sm"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;