import React from 'react';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-950 text-gray-300 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Main Content Wrapper */}
      <div className="max-w-4xl mx-auto space-y-12 p-6 md:p-12 lg:p-20 w-full flex-grow mb-10">
        
        {/* Header Section */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-400">
            At AlgoSay, we prioritize the privacy and security of your data. This policy outlines how we collect, use, and protect your information when you use our historical backtesting platform.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-10 space-y-10 shadow-xl backdrop-blur-sm">
          
          {/* Section 1: Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              1. Information We Collect
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>To provide a seamless backtesting experience, we collect limited and necessary information:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-white">Account Details:</strong> Basic profile information (Name, Email ID, and Profile Picture) when you sign in via Google OAuth.</li>
                <li><strong className="text-white">Strategy Parameters:</strong> Quantitative trading rules, indicators, and multi-leg option strategies you create and save on our platform.</li>
                <li><strong className="text-white">Usage Data:</strong> Credit token balance, subscription history, and logs related to historical backtest simulations.</li>
              </ul>
              <p className="text-xs text-amber-400/90 font-mono bg-amber-950/20 border border-amber-950 p-3 rounded-lg mt-2">
                <strong>Note on Broker Data:</strong> Since AlgoSay is strictly a historical backtesting platform and does not perform live trading or broker order execution, we never collect, request, or store your live brokerage credentials (API keys, client IDs, or passwords).
              </p>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              2. How We Use Your Information
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>Your data is strictly used to operate and enhance our backtesting engine:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>To authenticate your account and securely manage your subscription and credit tokens.</li>
                <li>To parse natural language prompts using Google Generative AI into structured backtest rules.</li>
                <li>To execute your simulated strategies against our historical market database.</li>
                <li>To send critical account alerts, billing receipts, and platform updates.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Third-Party Services (Firebase & Razorpay) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              3. Third-Party Services & Payments
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We partner with trusted industry leaders to maintain high operational standards:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li><strong className="text-white">Firebase (Google):</strong> Used for secure user authentication and database storage (Firestore).</li>
              <li><strong className="text-white">Razorpay:</strong> Used for processing subscription payments and credit recharges safely under PCI-DSS compliance. AlgoSay does not store or process your credit card, debit card, or UPI PIN details.</li>
            </ul>
          </section>

          {/* Section 4: Data Security & Strategy IP Protection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              4. Data Security & Strategy Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We employ robust encryption protocols (HTTPS/TLS) for data in transit. Your custom backtesting strategies stored in our database are strictly private, tied uniquely to your user profile, and are never shared, sold, or used to trade live markets.
            </p>
          </section>

          {/* Section 5: Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-gray-500"></span>
              5. Your Data Rights & Account Deletion
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You retain full control over your data. You can delete your saved strategies at any time from your dashboard. If you wish to permanently delete your account and all associated data from our servers, you can contact our support team.
            </p>
          </section>

        </div>

        {/* Footer Contact Info */}
        <div className="text-center text-gray-500 pt-8 border-t border-gray-800">
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@algosay.com" className="text-cyan-400 hover:underline">support@algosay.com</a></p>
        </div>

      </div>

      {/* 💎 Global Footer Rendered Here */}
      <Footer />

    </div>
  );
};

export default PrivacyPolicy;