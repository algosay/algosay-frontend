import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Update path if needed
import { doc, getDoc } from 'firebase/firestore';

// 🚨 Accept userProfileData prop passed from App.js 🚨
const UserProfile = ({ onClose, userProfileData }) => {
  // Initialize with userProfileData if available, otherwise null
  const [userData, setUserData] = useState(userProfileData || null);
  // If userProfileData is already there, no need to show loading spinner
  const [loading, setLoading] = useState(!userProfileData);

  useEffect(() => {
    const fetchUserData = async () => {
      // Only fetch from DB if userProfileData prop is missing
      if (auth.currentUser && !userProfileData) {
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
  }, [userProfileData]);

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
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-[#0F1B2D] border-t-transparent rounded-full animate-spin"></div>
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
    // z-[999] keeps it strictly above the header
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      
      {/* mt-16 keeps the modal below the top nav */}
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col mt-16 md:mt-20">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-[#0F1B2D] tracking-tight flex items-center gap-2.5">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile content */}
        <div className="p-5 space-y-4 bg-[#F4F5F7]">
          
          {/* Name, email, mobile */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-11 h-11 bg-[#0F1B2D] rounded-full flex items-center justify-center text-lg font-semibold text-white shrink-0">
                {(userData?.name || auth.currentUser?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Trader profile</p>
                <p className="text-base text-[#0F1B2D] font-semibold capitalize">{userData?.name || 'Algo Trader'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-0.5">Registered email</p>
                <p className="text-sm text-[#0F1B2D] font-medium truncate">{auth.currentUser?.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-0.5">Mobile number</p>
                <p className="text-sm text-[#0F1B2D] font-medium font-mono">{userData?.mobile || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Credits card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-indigo-500">
              <p className="text-xs text-slate-500 font-medium mb-1.5">Available credits</p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-semibold font-mono text-[#0F1B2D] leading-none">
                  {userData?.credits || 0}
                </span>
                <span className="text-xs text-slate-400 font-medium mb-0.5">tokens</span>
              </div>
            </div>

            {/* Unlimited plan card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-amber-500">
              <p className="text-xs text-slate-500 font-medium mb-1.5">Unlimited plan</p>
              {daysLeft > 0 ? (
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-semibold font-mono text-[#0F1B2D] leading-none">{daysLeft}</span>
                    <span className="text-xs text-slate-400 font-medium mb-0.5">days left</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2.5 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Active until {exactExpiryDate}
                  </p>
                </div>
              ) : (
                <div className="mt-0.5">
                  <p className="text-base font-semibold text-slate-400">No active plan</p>
                  <p className="text-xs text-slate-400 mt-1">Upgrade to get unlimited backtests.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-slate-200 bg-white flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-all text-sm cursor-pointer"
          >
            Back
          </button>
          
          <button 
            onClick={() => {
              auth.signOut();
              window.location.reload();
            }} 
            className="flex-1 py-2 bg-white hover:bg-rose-50 text-rose-600 font-semibold rounded-lg border border-rose-300 transition-all text-sm cursor-pointer"
          >
            Log out
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;