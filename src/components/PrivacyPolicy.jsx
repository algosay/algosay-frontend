import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-400">
            At AlgoSay, we prioritize the privacy and security of your data. This policy outlines how we collect, use, and protect your information when you use our algorithmic backtesting platform.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 md:p-10 space-y-10 shadow-xl backdrop-blur-sm">
          
          {/* Section 1: Data Collection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              1. Information We Collect
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>We collect information that you voluntarily provide to us when registering and using AlgoSay:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong>Account Data:</strong> Name, email address, and profile picture (via Google OAuth or email signup) powered by Firebase Authentication.</li>
                <li><strong>Trading Strategies:</strong> Custom parameters, natural language prompts, and strategy configurations you save to your profile.</li>
                <li><strong>Usage Data:</strong> Backtest logs, AI diagnostic queries, and interaction metrics to improve our platform's performance.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Data Usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              2. How We Use Your Information
            </h2>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>Your data is strictly used to provide and enhance our services:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>To authenticate your account and securely manage your subscription credits.</li>
                <li>To process natural language inputs via Google Generative AI for strategy parsing and diagnostics.</li>
                <li>To execute your multi-leg options strategies against our historical cloud data engine.</li>
                <li>To communicate important updates, security alerts, and support messages.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Third-Party Services (Crucial for Razorpay & Firebase) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              3. Third-Party Services & Payments
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We integrate with trusted third-party services to operate AlgoSay safely. We use <strong>Firebase (Google)</strong> for secure database storage (Firestore) and authentication. For payments, we use <strong>Razorpay</strong>. AlgoSay does not store or process your credit card or UPI details directly; all transactions are handled securely by Razorpay's PCI-compliant gateway.
            </p>
          </section>

          {/* Section 4: Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              4. Data Security & IP Protection
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We employ industry-standard encryption protocols (HTTPS/TLS) for data in transit and at rest. Your custom strategies saved in our Firestore database are strictly private and linked uniquely to your User ID. Our system executes these strategies in isolated environments to ensure data integrity and prevent cross-contamination.
            </p>
          </section>

          {/* Section 5: Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-400 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-gray-500"></span>
              5. Your Data Rights
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time. You can clear your saved strategies directly from the "My Strategies" dashboard. To request a complete deletion of your AlgoSay account and associated data, please contact our support team.
            </p>
          </section>

        </div>

        {/* Footer Contact Info */}
        <div className="text-center text-gray-500 pt-8 border-t border-gray-800">
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@algosay.com" className="text-cyan-400 hover:underline">support@algosay.com</a></p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;