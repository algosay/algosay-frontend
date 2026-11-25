import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Update path if needed
import { doc, updateDoc, increment } from 'firebase/firestore';

// 🔴 Website full ah complete aana apram idha `true` nu maathunga
const PAYMENTS_ENABLED = false;

// Razorpay script-ah safe ah load panra function
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
    { id: 'u3', name: 'Quarterly', desc: 'Unlimited Backtests for 90 days', price: 3999, highlight: true, tag: 'Most popular' },
    { id: 'u4', name: 'Half-Yearly', desc: 'Unlimited Backtests for 180 days', price: 7499 },
  ];

  // Calculate dynamic custom price
  const calculateCustomPrice = (credits) => {
    if (credits < 25) return credits * 4.90;
    if (credits < 50) return credits * 4.00;
    if (credits < 100) return credits * 3.60;
    return credits * 3.00;
  };

  // Razorpay Payment Logic
  const handlePayment = async () => {
      // 🔴 Payments disable guard (button bypass panninaalum payment poga koodathu)
      if (!PAYMENTS_ENABLED) {
          alert("Our website is under improvement. Payments will be enabled soon!");
          return;
      }

      if (!selectedPlan || !auth.currentUser) {
          alert("Please login and select a plan!");
          return;
      }

      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
          alert("Failed to load Razorpay payment gateway. Please check your internet connection.");
          return;
      }

      const user = auth.currentUser;
      let finalAmount = 0;
      let creditsToAdd = 0;
      let planName = "";
      let daysToAdd = 0;

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
          planName = plan.name;
          daysToAdd = selectedPlan === 'u1' ? 7 : (selectedPlan === 'u2' ? 30 : (selectedPlan === 'u3' ? 90 : 180));
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
                  credits: creditsToAdd // Will be 0 for unlimited, which is fine
              })
          });

          const orderData = await orderResponse.json();

          // 2. Razorpay Checkout Options
          const options = {
              key: orderData.key,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "AlgoSay Pro",
              description: activeTab === 'payg' ? `Purchase of ${creditsToAdd} Credits` : `${planName} Unlimited Plan`,
              order_id: orderData.order_id,
              handler: async function (response) {
                  // 3. Payment Success aana odane Firebase-la Update pandrom
                  try {
                      const userRef = doc(db, 'users', user.uid);

                      if (activeTab === 'payg') {
                          await updateDoc(userRef, {
                              credits: increment(creditsToAdd)
                          });
                          alert(`✅ Payment Successful! ${creditsToAdd} Credits added to your account.`);
                      } else {
                          const expiryDate = new Date();
                          expiryDate.setDate(expiryDate.getDate() + daysToAdd);

                          await updateDoc(userRef, {
                              subscription: {
                                  is_active: true,
                                  plan_type: planName,
                                  end_date: expiryDate.toISOString()
                              }
                          });
                          alert(`✅ Payment Successful! ${planName} Unlimited Plan activated until ${expiryDate.toLocaleDateString()}.`);
                      }

                      onClose(); // Close Modal
                      window.location.reload(); // Refresh to update UI
                  } catch (err) {
                      console.error("Firebase update failed", err);
                      alert("Payment successful, but failed to update account. Contact support.");
                  }
              },
              prefill: {
                  name: user.displayName || "Trader",
                  email: user.email,
              },
              theme: {
                  color: "#0F1B2D"
              }
          };

          // 4. Razorpay Modal open
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

  const Radio = ({ on }) => (
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${on ? 'border-[#0F1B2D]' : 'border-slate-300'}`}>
      {on && <div className="w-2 h-2 bg-[#0F1B2D] rounded-full"></div>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="shrink-0 px-5 py-4 border-b border-slate-200 flex justify-between items-start sm:items-center bg-slate-50 flex-col sm:flex-row gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-md transition-all cursor-pointer text-xs font-semibold border border-slate-300 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <div>
              <h2 className="text-lg font-semibold text-[#0F1B2D] tracking-tight">Upgrade your account</h2>
              <p className="text-slate-500 text-xs mt-0.5">Choose the plan that fits your trading style.</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer hidden sm:block shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* UNDER IMPROVEMENT NOTICE */}
        {!PAYMENTS_ENABLED && (
          <div className="shrink-0 px-5 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center">
            Website is under improvement. Payments will open soon.
          </div>
        )}

        {/* TABS */}
        <div className="shrink-0 flex p-3 bg-white gap-2 border-b border-slate-200 z-10 relative">
          <button
            onClick={() => { setActiveTab('payg'); setSelectedPlan(null); }}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer border ${
              activeTab === 'payg'
                ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
            }`}
          >
            Pay-as-you-go credits
          </button>

          <button
            onClick={() => { setActiveTab('unlimited'); setSelectedPlan(null); }}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer border ${
              activeTab === 'unlimited'
                ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
            }`}
          >
            Unlimited plans
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 relative bg-[#F4F5F7]">

          {/* TAB 1: PAY AS YOU GO */}
          {activeTab === 'payg' && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-2 gap-3">
                {paygPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative cursor-pointer p-4 rounded-xl border transition-all ${
                      selectedPlan === plan.id
                        ? 'border-[#0F1B2D] bg-white ring-1 ring-[#0F1B2D]'
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        {plan.tag}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-lg font-semibold text-[#0F1B2D]">{plan.credits} <span className="text-xs font-normal text-slate-500">credits</span></span>
                      <Radio on={selectedPlan === plan.id} />
                    </div>
                    <div className="text-xl font-semibold font-mono text-indigo-600">₹{plan.price}</div>
                  </div>
                ))}
              </div>

              {/* Custom credit slider */}
              <div
                className={`p-5 rounded-xl border transition-all cursor-pointer bg-white ${
                  selectedPlan === 'custom' ? 'border-[#0F1B2D] ring-1 ring-[#0F1B2D]' : 'border-slate-200 hover:border-slate-400'
                }`}
                onClick={() => setSelectedPlan('custom')}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-[#0F1B2D]">Need a custom amount?</span>
                  <Radio on={selectedPlan === 'custom'} />
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
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F1B2D] mb-3"
                />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-semibold font-mono text-[#0F1B2D]">{customCredits}</span>
                    <span className="text-slate-500 text-sm ml-1.5">credits</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold font-mono text-indigo-600">₹{Math.round(calculateCustomPrice(customCredits))}</div>
                    <div className="text-[11px] text-slate-400">Discount applied automatically</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNLIMITED PLANS */}
          {activeTab === 'unlimited' && (
            <div className="space-y-3 animate-fade-in-up">
              {unlimitedPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center bg-white ${
                    selectedPlan === plan.id
                      ? 'border-[#0F1B2D] ring-1 ring-[#0F1B2D]'
                      : plan.highlight
                        ? 'border-amber-300 bg-amber-50/50'
                        : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-5 bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      {plan.tag}
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <Radio on={selectedPlan === plan.id} />
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F1B2D]">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.desc}</p>
                    </div>
                  </div>
                  <div className="text-xl font-semibold font-mono text-[#0F1B2D] shrink-0">₹{plan.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="shrink-0 px-5 py-4 border-t border-slate-200 bg-white">
          <button
            onClick={handlePayment}
            disabled={!PAYMENTS_ENABLED || !selectedPlan}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
              !PAYMENTS_ENABLED || !selectedPlan
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#0F1B2D] hover:bg-[#1c2d47] text-white cursor-pointer'
            }`}
          >
            {!PAYMENTS_ENABLED
              ? 'Coming soon (under improvement)'
              : selectedPlan ? 'Proceed to payment' : 'Select a plan'}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
             <i className="fa-solid fa-lock"></i> Secure 256-bit encrypted checkout
          </p>
        </div>

      </div>
    </div>
  );
};

export default PricingModal;