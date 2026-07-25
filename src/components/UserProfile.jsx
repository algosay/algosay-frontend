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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // UPDATED LINE: Checking subscription.is_active and using subscription.end_date
  const daysLeft = (userData?.subscription?.is_active && userData?.subscription?.end_date) 
    ? calculateDaysLeft(userData.subscription.end_date) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151515]">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          
          {/* Email Info */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {auth.currentUser?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Registered Email</p>
              <p className="text-lg text-white font-bold">{auth.currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pay-As-You-Go Credits Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-[#1a1a1a] p-5 rounded-xl border border-blue-500/30">
              <p className="text-sm text-blue-400 font-bold mb-1">Available Credits</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">
                  {userData?.credits || 0}
                </span>
                       </div>
            </div>

            {/* Unlimited Plan Card */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-[#1a1a1a] p-5 rounded-xl border border-yellow-500/30">
              <p className="text-sm text-yellow-500 font-bold mb-1">Unlimited Plan</p>
              {daysLeft > 0 ? (
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{daysLeft}</span>
                    <span className="text-sm text-gray-400 mb-1">Days Left</span>
                  </div>
                  <p className="text-xs text-green-400 mt-2 font-semibold">✅ Active</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-gray-500 mt-2">No Active Plan</p>
                  <p className="text-xs text-gray-600 mt-1">Upgrade to get unlimited.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-gray-800 bg-[#151515]">
          <button 
            onClick={() => {
              auth.signOut();
              window.location.reload();
            }} 
            className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold rounded-xl border border-red-500/30 transition-all"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;