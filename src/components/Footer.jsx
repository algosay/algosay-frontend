import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800/80 font-sans selection:bg-cyan-900 selection:text-cyan-100 relative overflow-hidden">
      
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 space-y-12">
        
        {/* Top Section: Branding & Links Grid (5 Columns to pull columns left) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: AlgoSay Branding & Tech Stack (Takes 2 cols on LG) */}
          <div className="lg:col-span-2 space-y-5 lg:pr-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                AlgoSay
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 uppercase tracking-widest">
                v2.0
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Institutional-grade algorithmic backtesting engine powered by zero-memory cloud streaming, DuckDB, Polars, and multi-lingual AI Neural Diagnostics.
            </p>

            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-900 border border-gray-800 text-gray-400">
                Cloudflare R2
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-900 border border-gray-800 text-cyan-400">
                DuckDB + Polars
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-900 border border-gray-800 text-purple-400">
                Google AI
              </span>
            </div>
          </div>

          {/* Spacer Column on Large screens to pull remaining columns left */}
          <div className="hidden lg:block lg:col-span-0" />

          {/* Column 2: Company & Legal (Pushed Left) */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-us" className="hover:text-cyan-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-cyan-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund & Cancellation</Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-cyan-400 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Careers 
                  <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-1.5 py-0.2 rounded">Hiring</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Secure Gateway (Pushed Left) */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Secure Gateway
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              All subscription payments and credit token recharges are encrypted and processed securely via Razorpay PCI-DSS compliant infrastructure.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300 font-mono">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                256-Bit SSL Encrypted
              </div>
            </div>
          </div>

        </div>

        {/* SEBI Regulatory & Market Reality Warning Box */}
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold font-mono uppercase tracking-wider">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            SEBI Regulatory Risk Warning
          </div>
          <p className="text-red-200/60 text-xs leading-relaxed font-mono">
            <strong>SEBI Study Disclosure:</strong> 9 out of 10 individual traders in the equity Futures and Options (F&O) segment incur net losses. AlgoSay provides quantitative software tools for backtesting and historical data analysis only. We are NOT a SEBI-registered Investment Advisor or Research Analyst. Backtest results do not guarantee future live performance.
          </p>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>© {new Date().getFullYear()} AlgoSay Systems. All rights reserved.</p>
          <p>Designed for Quantitative & Retail Options Traders in India.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;