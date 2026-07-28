import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header / Hero Section */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            About AlgoSay
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            Institutional-grade algorithmic backtesting, engineered for the modern quant trader.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="group relative bg-gray-900/60 border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl pointer-events-none" />
            <h2 className="text-3xl font-semibold text-cyan-400 mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              Our Vision
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              To democratize quantitative trading by providing retail and institutional traders with lightning-fast, highly accurate backtesting infrastructure. We believe that robust data and zero-friction execution should be accessible to everyone, not just Wall Street quants.
            </p>
          </div>

          {/* Mission Card */}
          <div className="group relative bg-gray-900/60 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl pointer-events-none" />
            <h2 className="text-3xl font-semibold text-purple-400 mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              To eliminate the technical barriers in algorithmic trading. By leveraging cutting-edge cloud architecture and generative AI diagnostics, AlgoSay empowers traders to formulate, test, and refine multi-leg options strategies purely through natural language.
            </p>
          </div>
        </div>

        {/* The AlgoSay Edge (Core Tech Focus) */}
        <div className="bg-gray-900/40 border border-blue-900/30 rounded-3xl p-8 md:p-14 relative overflow-hidden">
          {/* Background Cyberpunk Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AlgoSay Edge</span>
          </h2>
          
          <div className="space-y-10">
            {/* Edge 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-cyan-950/50 flex items-center justify-center border border-cyan-500/40 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="text-cyan-400 font-mono font-bold text-xl">01</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-100 tracking-wide">Zero-Memory Cloud Streaming</h3>
                <p className="text-gray-400 mt-3 text-lg leading-relaxed">
                  Say goodbye to browser crashes and high RAM usage. Our proprietary data engine pulls, caches, and resamples historical Spot, Futures, and Options market data directly from Cloudflare R2 object storage via DuckDB and Polars, processing massive multi-leg datasets instantly on the server.
                </p>
              </div>
            </div>

            {/* Edge 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-purple-950/50 flex items-center justify-center border border-purple-500/40 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <span className="text-purple-400 font-mono font-bold text-xl">02</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-100 tracking-wide">AI Neural Diagnostics</h3>
                <p className="text-gray-400 mt-3 text-lg leading-relaxed">
                  Powered by Google Generative AI, our platform parses natural language prompts (Tanglish, Hindi, English) into complex JSON risk parameters. Post-backtest, it acts as your personal quant, analyzing drawdowns and heatmaps to give you institutional-grade trading advice.
                </p>
              </div>
            </div>

            {/* Edge 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-xl bg-red-950/50 flex items-center justify-center border border-red-500/40 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="text-red-400 font-mono font-bold text-xl">03</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-100 tracking-wide">SEBI Market Reality Integration</h3>
                <p className="text-gray-400 mt-3 text-lg leading-relaxed">
                  We don't sell pipe dreams. AlgoSay enforces real-world market reality by dynamically calculating accurate STT/CTT, GST, Exchange transaction charges, stamp duty, and margin requirements. You see the exact Net P&L—because grosses don't pay the bills.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEBI Compliance Disclaimer */}
        <div className="mt-16 bg-red-950/10 border-l-4 border-red-500/70 rounded-r-xl p-6 md:p-8 backdrop-blur-sm">
          <h4 className="font-bold text-red-400 mb-3 text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Regulatory & Risk Disclaimer
          </h4>
          <p className="text-red-200/70 text-sm md:text-base leading-relaxed font-mono">
            AlgoSay provides software tools for quantitative backtesting and data analysis only. We are NOT a SEBI registered investment advisor or broker-dealer. 9 out of 10 individual traders in the equity Futures and Options (F&O) segment incur net losses. Algorithmic trading carries a high level of risk and may not be suitable for all investors. Past performance of any trading system or methodology is not necessarily indicative of future results.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;