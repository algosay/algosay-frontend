import React, { useState } from 'react';
// 🚨 Mela Import section-la itha add panniyachu (auth & firestore use panna)
import { auth, db } from '../firebase'; // Update path if needed
import { doc, updateDoc, increment } from 'firebase/firestore';

const PricingModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('payg'); // 'payg' or 'unlimited'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customCredits, setCustomCredits] = useState(10);

  // Pay-As-You-Go Pricing Logic
  const paygPlans = [
    { id: 'p1', credits: 10, price: 49, tag: 'Starter' },
    { id: 'p2', credits: 25, price: 99, tag: 'Value' },
    { id: 'p3', credits: 50, price: 179, tag: 'Popular', highlight: true },
    { id: 'p4', credits: 100, price: 299, tag: 'Pro' },
  ];

  // Unlimited Plans (No AI Tokens)
  const unlimitedPlans = [
    { id: 'u1', name: 'Weekly', desc: 'Unlimited Backtests for 7 days', price: 599 },
    { id: 'u2', name: 'Monthly', desc: 'Unlimited Backtests for 30 days', price: 1599 },
    { id: 'u3', name: 'Quarterly', desc: 'Unlimited Backtests for 90 days', price: 3999, highlight: true, tag: 'MOST POPULAR' },
    { id: 'u4', name: 'Half-Yearly', desc: 'Unlimited Backtests for 180 days', price: 7499 },
  ];

  // Calculate dynamic custom price
  const calculateCustomPrice = (credits) => {
    if (credits < 25) return credits * 4.90;
    if (credits < 50) return credits * 4.00;
    if (credits < 100) return credits * 3.60;
    return credits * 3.00;
  };

  // 🟢 Razorpay Payment Logic (PricingModal kulla ezuthiyachu)
  const handlePayment = async () => {
      if (!selectedPlan || !auth.currentUser) {
          alert("Please login and select a plan!");
          return;
      }

      const user = auth.currentUser;
      let finalAmount = 0;
      let creditsToAdd = 0;

      // Calculate Price based on user selection
      if (activeTab === 'payg') {
          if (selectedPlan === 'custom') {
              finalAmount = Math.round(calculateCustomPrice(customCredits));
              creditsToAdd = customCredits;
          } else {
              const plan = paygPlans.find(p => p.id === selectedPlan);
              finalAmount = plan.price;
              creditsToAdd = plan.credits;
          }
      } else {
          const plan = unlimitedPlans.find(p => p.id === selectedPlan);
          finalAmount = plan.price;
          creditsToAdd = 999999; // Unlimited logic (or however you handle it in DB)
      }

      try {
          // 1. Backend-ku call panni Order ID vaangurathu
          const orderResponse = await fetch("https://algosay-backend.onrender.com/create_razorpay_order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  amount: finalAmount,
                  user_id: user.uid,
                  plan_id: selectedPlan,
                  credits: creditsToAdd
              })
          });

          const orderData = await orderResponse.json();

          // 2. Razorpay Checkout Options set pandrom
          const options = {
              key: orderData.key, 
              amount: orderData.amount,
              currency: orderData.currency,
              name: "AlgoSay Pro",
              description: `Purchase of ${creditsToAdd} Credits`,
              order_id: orderData.order_id, 
              handler: async function (response) {
                  // 3. Payment Success aana odane Firebase-la credits add pandrom! 🟢
                  try {
                      const userRef = doc(db, 'users', user.uid);
                      await updateDoc(userRef, {
                          credits: increment(creditsToAdd)
                      });
                      alert(`✅ Payment Successful! ${creditsToAdd} Credits added to your account.`);
                      onClose(); // Close Modal
                      window.location.reload(); // Refresh to update UI
                  } catch (err) {
                      console.error("Firebase update failed", err);
                      alert("Payment successful, but failed to update credits. Contact support.");
                  }
              },
              prefill: {
                  name: user.displayName || "Trader",
                  email: user.email,
              },
              theme: {
                  color: "#3B82F6" // Blue theme
              }
          };

          // 4. Razorpay Modal-a open pandrom
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
              alert("❌ Payment Failed! Reason: " + response.error.description);
          });
          rzp.open();

      } catch (error) {
          console.error("Error initiating payment:", error);
          alert("Failed to initialize payment gateway. Please try again.");
      }
  };

  if (!isOpen) return null;

  return (
    /* MAIN WRAPPER ADDED HERE - This fixes all the errors! */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header & Close Button */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151515]">
          <div>
            <h2 className="text-2xl font-bold text-white">Upgrade Your Account</h2>
            <p className="text-gray-400 text-sm mt-1">Choose the plan that fits your trading style.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-4 bg-[#0a0a0a]">
          <button
            onClick={() => { setActiveTab('payg'); setSelectedPlan(null); }}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'payg' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Pay-As-You-Go Credits
          </button>
          <div className="w-4"></div>
          <button
            onClick={() => { setActiveTab('unlimited'); setSelectedPlan(null); }}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'unlimited' 
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Unlimited Plans
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* TAB 1: PAY AS YOU GO */}
          {activeTab === 'payg' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-2 gap-4">
                {paygPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative cursor-pointer p-5 rounded-xl border-2 transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-blue-500 bg-blue-900/10' 
                        : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                        {plan.tag}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-white">{plan.credits} <span className="text-sm font-normal text-gray-400">Credits</span></span>
                      {/* Custom Radio Button */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-blue-500' : 'border-gray-600'}`}>
                        {selectedPlan === plan.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">₹{plan.price}</div>
                  </div>
                ))}
              </div>

              {/* Custom Credit Slider Section */}
              <div 
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPlan === 'custom' ? 'border-blue-500 bg-blue-900/10' : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'
                }`}
                onClick={() => setSelectedPlan('custom')}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-white">Need a custom amount?</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'custom' ? 'border-blue-500' : 'border-gray-600'}`}>
                    {selectedPlan === 'custom' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
                
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={customCredits} 
                  onChange={(e) => {
                    setCustomCredits(Number(e.target.value));
                    setSelectedPlan('custom');
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
                />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold text-white">{customCredits}</span>
                    <span className="text-gray-400 ml-2">Credits</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">₹{Math.round(calculateCustomPrice(customCredits))}</div>
                    <div className="text-xs text-gray-500">Auto-calculated discount</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNLIMITED PLANS */}
          {activeTab === 'unlimited' && (
            <div className="space-y-4 animate-fade-in-up">
              {unlimitedPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer p-5 rounded-xl border-2 transition-all flex justify-between items-center ${
                    selectedPlan === plan.id 
                      ? 'border-yellow-500 bg-yellow-900/10' 
                      : plan.highlight 
                        ? 'border-yellow-600/50 bg-gradient-to-r from-yellow-900/20 to-[#1a1a1a]'
                        : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-lg shadow-yellow-900/50">
                      {plan.tag}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === plan.id ? 'border-yellow-500' : 'border-gray-600'}`}>
                      {selectedPlan === plan.id && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-gray-400">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 shrink-0">₹{plan.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Button */}
        <div className="p-6 border-t border-gray-800 bg-[#151515]">
          <button 
            onClick={handlePayment} /* 🚨 INTHA LINE ADD PANNIYACHU */
            disabled={!selectedPlan}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !selectedPlan 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : activeTab === 'payg'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 cursor-pointer'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-900/20 cursor-pointer'
            }`}
          >
            {selectedPlan ? 'Proceed to Payment' : 'Select a Plan'}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
             <i className="fa-solid fa-lock"></i> Secure 256-bit encrypted checkout
          </p>
        </div>

      </div>
    </div>
  );
};

export default PricingModal;