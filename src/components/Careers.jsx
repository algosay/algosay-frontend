import React, { useState } from 'react';

const Careers = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const jobOpenings = [
    {
      id: 'quant-engineer',
      title: 'Quantitative Strategy Researcher',
      type: 'Full-time / Remote',
      location: 'India (Remote)',
      department: 'Quantitative Research',
      description: 'We are looking for a Quant Researcher to design, backtest, and optimize complex multi-leg options and futures strategies across NSE/BSE indices.',
      requirements: [
        'Strong knowledge of Indian derivatives markets (Nifty, BankNifty, FinNifty options spreads).',
        'Proficiency in Python, Pandas, Polars, and statistical modeling.',
        'Experience analyzing drawdowns, slippage, and real-world execution costs.'
      ]
    },
    {
      id: 'fullstack-dev',
      title: 'Senior React Frontend Engineer',
      type: 'Full-time',
      location: 'Cyberabad / Remote',
      department: 'Engineering',
      description: 'Build institutional-grade financial dashboards, HTML5 canvas charts, dynamic heatmaps, and seamless AI diagnostic interfaces using React and Tailwind CSS.',
      requirements: [
        '3+ years experience with React, HTML5 Canvas / Charting libraries, and Tailwind CSS.',
        'Deep understanding of state management, custom hooks, and WebSocket integration.',
        'Eye for cyberpunk dark-mode aesthetic and smooth micro-animations.'
      ]
    },
    {
      id: 'data-engineer',
      title: 'High-Performance Systems & Data Engineer',
      type: 'Full-time',
      location: 'Cyberabad / Remote',
      department: 'Infrastructure',
      description: 'Architect zero-memory data streaming pipelines using DuckDB, Polars, FastAPI, and Cloudflare R2 object storage for sub-second backtest processing.',
      requirements: [
        'Strong background in Python, AsyncIO, FastAPI, DuckDB, and Polars.',
        'Experience handling high-frequency market tick/1-min data and RAM-isolated cloud caching.',
        'Familiarity with cloud object storage (Cloudflare R2, AWS S3) and Docker.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-900 selection:text-cyan-100">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            We're Hiring Quants & Engineers
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Build the Future of Algorithmic Trading
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            At AlgoSay, we are democratizing quantitative finance. Join our team to build high-frequency data engines, AI diagnostics, and institutional backtesting platforms.
          </p>
        </div>

        {/* Why Join Us Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold mb-4">
              01
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Bleeding-Edge Tech Stack</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Work with FastAPI, DuckDB, Polars, Cloudflare R2, Google AI, and React to build ultra-low latency data tools.
            </p>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 flex items-center justify-center font-mono font-bold mb-4">
              02
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Remote-First Culture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We value output over hours. Work remotely or from our tech hub with flexible hours and modern dev tooling.
            </p>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono font-bold mb-4">
              03
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Market Reality Mindset</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No theoretical fluff. We build real-world tools that accurately calculate STT, slippage, and institutional risk metrics.
            </p>
          </div>
        </div>

        {/* Job Openings Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Current Openings</h2>
              <p className="text-gray-400 mt-1">Explore available opportunities to engineer with us.</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-md border border-cyan-800/50">
              {jobOpenings.length} Positions Available
            </span>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div 
                key={job.id}
                className="bg-gray-900/40 border border-gray-800 hover:border-cyan-500/40 rounded-2xl p-6 md:p-8 transition-all duration-300 backdrop-blur-sm group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{job.department}</span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mt-1">
                      {job.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">{job.type}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">{job.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {job.description}
                </p>

                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase font-mono tracking-wider">Key Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between">
                  <a 
                    href={`mailto:careers@algosay.com?subject=Application for ${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                  >
                    Apply for this Role
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Application Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950/40 border border-gray-800 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-2xl md:text-3xl font-bold text-white">Don't see a role that fits?</h3>
          <p className="text-gray-400 max-w-xl mx-auto">
            We are always looking for exceptional quants, backend engineers, and data specialists. Send your resume and Github profile to our team.
          </p>
          <div>
            <a 
              href="mailto:careers@algosay.com?subject=General Application - AlgoSay Core Team"
              className="inline-block px-8 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-cyan-400 font-bold transition-all"
            >
              Email Resume to careers@algosay.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Careers;