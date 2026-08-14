import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultsShowcase from './components/ResultsShowcase';
import StrategyTemplates from './components/StrategyTemplates';
import Footer from './components/Footer';

// இம்போர்ட் செய்யப்பட்ட பிரிவுகள் (Make sure paths are correct)
import HeroSection from './components/HeroSection';
import StepsSection from './components/StepsSection';
import MultilingualSection from './components/MultilingualSection';
import VideoShowcaseSection from './components/VideoShowcaseSection';
import FeaturesAndPricing from './components/FeaturesAndPricing';

const HomeView = ({ onNavigate, custom, viewVariants }) => {
  const [zoomedImage, setZoomedImage] = useState(null);

  return (
    <motion.div 
      custom={custom}
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full min-h-screen relative px-6 md:px-12 lg:px-20 py-4 z-10 bg-[#04060F] overflow-hidden font-sans"
    >
      <img src="/image/header right.png" alt="Right Glow" className="absolute top-0 right-0 w-full lg:w-[45%] h-full object-cover mix-blend-screen opacity-20 z-0 pointer-events-none" />

      {/* Grid layer */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #334155 1px, transparent 1px), 
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* Component 1: Header, Hero, and Stats */}
      <HeroSection onNavigate={onNavigate} />

      {/* Component 2: Infinite Horizontal Scrolling Steps */}
      <StepsSection />

      {/* Component 3: Multilingual Support */}
      <MultilingualSection />

      {/* Component 4: Video Showcase */}
      <VideoShowcaseSection />

      <div className="w-full scroll-mt-24">
        {/* External Components (You already have them) */}
        <ResultsShowcase setZoomedImage={setZoomedImage} />
        <div id="templates" className="scroll-mt-24">
           <StrategyTemplates />
        </div>

        {/* Component 5: Capabilities, Reviews, Pricing */}
        <FeaturesAndPricing onNavigate={onNavigate} />
      </div>

      {/* IMAGE ZOOM MODAL OVERLAY */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 md:p-12 cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={zoomedImage} 
              alt="Zoomed Report" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(0,229,255,0.2)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* External Footer Component */}
      <Footer />

    </motion.div>
  );
};   

export default HomeView;