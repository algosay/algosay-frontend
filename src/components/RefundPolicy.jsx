import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-400">
            At AlgoSay, we strive to provide a seamless algorithmic backtesting experience. Please review our strict cancellation and refund guidelines for subscriptions and pay-as-you-go credits.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-10 space-y-10 shadow-xl backdrop-blur-sm">
          
          {/* Section 1: Subscription Cancellations */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              1. Subscription Cancellations
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>
                You can cancel your active AlgoSay subscription at any time through your Account Dashboard / User Profile. 
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>If you cancel your subscription, the cancellation will take effect at the end of your current billing cycle.</li>
                <li>You will continue to have full access to our backtesting platform and AI diagnostics until the current billing period expires.</li>
                <li>We do not offer partial prorated refunds for mid-cycle cancellations.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Pay-As-You-Go Credits */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              2. Pay-As-You-Go Token Credits
            </h2>
            <p className="text-gray-300 leading-relaxed">
              AlgoSay token credits purchased for executing specific backtests or AI queries are strictly <strong>non-refundable and non-transferable</strong>. Once credits are added to your AlgoSay wallet, they cannot be exchanged for fiat currency. Please ensure you select the correct credit package before completing your transaction via Razorpay.
            </p>
          </section>

          {/* Section 3: Failed Transactions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              3. Failed or Pending Transactions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If a transaction fails but the amount is debited from your bank account or credit card, our payment gateway partner (Razorpay) will automatically initiate a refund. 
              The refunded amount will be credited back to your original payment method within <strong>5 to 7 working days</strong>, depending on your bank's processing time.
            </p>
          </section>

          {/* Section 4: Exceptional Circumstances (Refund Eligibility) */}
          <section className="space-y-4 bg-red-950/20 border-l-4 border-red-500 p-6 rounded-r-lg">
            <h2 className="text-2xl font-semibold text-red-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
              4. Exceptions for Refunds
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3 font-mono text-sm md:text-base">
              <p>Refunds are only processed under the following exceptional circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Duplicate payment processed due to a technical glitch on our platform.</li>
                <li>Credits not reflecting in your AlgoSay wallet after 24 hours of a successful transaction.</li>
              </ul>
              <p className="pt-2 text-red-300">
                In such cases, please raise a support ticket within 48 hours of the transaction. If approved, the refund will be processed within 5-7 business days.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Contact Info */}
        <div className="text-center text-gray-500 pt-8 border-t border-gray-800">
          <p>For any billing or refund-related queries, please reach out to our team at <a href="mailto:support@algosay.com" className="text-cyan-400 hover:underline">support@algosay.com</a></p>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;